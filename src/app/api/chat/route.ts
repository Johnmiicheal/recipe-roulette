/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/api/chat/route.ts
import { xai } from '@ai-sdk/xai'
import Exa from 'exa-js'
import {
  convertToCoreMessages,
  streamText,
  tool,
  smoothStream
} from "ai";
import { geolocation, ipAddress } from '@vercel/functions'
import { getGroupConfig } from "@/app/actions";
import z from "zod"


// Allow streaming responses up to 60 seconds
export const maxDuration = 120;

interface GoogleResult {
    place_id: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
    types: string[];
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }

interface MapboxFeature {
    id: string;
    name: string;
    formatted_address: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    feature_type: string;
    context: string;
    coordinates: number[];
    bbox: number[];
    source: string;
  }


export async function POST(req: Request) {
  const { messages, model, group } = await req.json();
  const { tools: activeTools, systemPrompt } = await getGroupConfig(group);


  const result = streamText({
    model: xai(model),
    messages: convertToCoreMessages(messages),
    experimental_transform: smoothStream({
      delayInMs: 15,
    }),
    experimental_activeTools: [...activeTools],
    system: systemPrompt,
    tools: {
      thinking_canvas: tool({
        description: "Write your plan of action in a canvas based on the user's input.",
        parameters: z.object({
          title: z.string().describe("The title of the canvas."),
          content: z.array(z.string()).describe("The content of the canvas."),
        }),
        execute: async ({ title, content }: { title: string, content: string[] }) => { return { title, content }; },
      }),
      youtube_search: tool({
        description: "Search YouTube videos using Exa AI and get detailed video information.",
        parameters: z.object({
          query: z.string().describe("The search query for YouTube videos"),
          no_of_results: z.number().default(5).describe("The number of results to return"),
        }),
        execute: async ({ query, no_of_results }: { query: string, no_of_results: number }) => {
          try {
            const exa = new Exa(process.env.EXA_API_KEY as string);

            // Simple search to get YouTube URLs only
            const searchResult = await exa.search(
              query,
              {
                type: "keyword",
                numResults: no_of_results,
                includeDomains: ["youtube.com"]
              }
            );

            return {
              results: searchResult
            };

          } catch (error) {
            console.error("YouTube search error:", error);
            throw error;
          }
        },
      }),
      find_place: tool({
        description: "Find a place using Google Maps API for forward geocoding and Mapbox for reverse geocoding.",
        parameters: z.object({
          query: z.string().describe("The search query for forward geocoding"),
          coordinates: z.array(z.number()).describe("Array of [latitude, longitude] for reverse geocoding"),
        }),
        execute: async ({ query, coordinates }: { query: string; coordinates: number[] }) => {
          try {
            // Forward geocoding with Google Maps API
            const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
            const googleResponse = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${googleApiKey}`
            );
            const googleData = await googleResponse.json();

            // Reverse geocoding with Mapbox
            const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
            const [lat, lng] = coordinates;
            const mapboxResponse = await fetch(
              `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxToken}`
            );
            const mapboxData = await mapboxResponse.json();

            // Process and combine results
            const features = [];

            // Process Google results
            if (googleData.status === 'OK' && googleData.results.length > 0) {


              features.push(...googleData.results.map((result: GoogleResult) => ({
                id: result.place_id,
                name: result.formatted_address.split(',')[0],
                formatted_address: result.formatted_address,
                geometry: {
                  type: 'Point',
                  coordinates: [result.geometry.location.lng, result.geometry.location.lat]
                },
                feature_type: result.types[0],
                address_components: result.address_components,
                viewport: result.geometry.viewport,
                place_id: result.place_id,
                source: 'google'
              })));
            }

            // Process Mapbox results
            if (mapboxData.features && mapboxData.features.length > 0) {

              features.push(...mapboxData.features.map((feature: any): MapboxFeature => ({
                id: feature.id,
                name: feature.properties.name_preferred || feature.properties.name,
                formatted_address: feature.properties.full_address,
                geometry: feature.geometry,
                feature_type: feature.properties.feature_type,
                context: feature.properties.context,
                coordinates: feature.properties.coordinates,
                bbox: feature.properties.bbox,
                source: 'mapbox'
              })));
            }

            return {
              features,
              google_attribution: "Powered by Google Maps Platform",
              mapbox_attribution: "Powered by Mapbox"
            };
          } catch (error) {
            console.error("Geocoding error:", error);
            throw error;
          }
        },
      }),
      text_search: tool({
        description: "Perform a text-based search for places using Mapbox API.",
        parameters: z.object({
          query: z.string().describe("The search query (e.g., '123 main street')."),
          location: z.string().describe("The location to center the search (e.g., '42.3675294,-71.186966')."),
          radius: z.number().describe("The radius of the search area in meters (max 50000)."),
        }),
        execute: async ({ query, location, radius }: {
          query: string;
          location?: string;
          radius?: number;
        }) => {
          const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

          let proximity = '';
          if (location) {
            const [lng, lat] = location.split(',').map(Number);
            proximity = `&proximity=${lng},${lat}`;
          }

          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=poi${proximity}&access_token=${mapboxToken}`
          );
          const data = await response.json();

          // If location and radius provided, filter results by distance
          let results = data.features;
          if (location && radius) {
            const [centerLng, centerLat] = location.split(',').map(Number);
            const radiusInDegrees = radius / 111320;
            results = results.filter((feature: any) => {
              const [placeLng, placeLat] = feature.center;
              const distance = Math.sqrt(
                Math.pow(placeLng - centerLng, 2) + Math.pow(placeLat - centerLat, 2)
              );
              return distance <= radiusInDegrees;
            });
          }

          return {
            results: results.map((feature: any) => ({
              name: feature.text,
              formatted_address: feature.place_name,
              geometry: {
                location: {
                  lat: feature.center[1],
                  lng: feature.center[0]
                }
              }
            }))
          };
        },
      }),

      nearby_search: tool({
        description: "Search for nearby places, such as restaurants or hotels based on the details given.",
        parameters: z.object({
          location: z.string().describe("The location name given by user."),
          latitude: z.number().describe("The latitude of the location."),
          longitude: z.number().describe("The longitude of the location."),
          type: z.string().describe("The type of place to search for (restaurants, hotels, attractions, geos)."),
          radius: z.number().default(6000).describe("The radius in meters (max 50000, default 6000)."),
        }),
        execute: async ({ location, latitude, longitude, type, radius }: {
          latitude: number;
          longitude: number;
          location: string;
          type: string;
          radius: number;
        }) => {
          const apiKey = process.env.TRIPADVISOR_API_KEY;
          let finalLat = latitude;
          let finalLng = longitude;

          try {
            // Try geocoding first
            const geocodingData = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
            );

            const geocoding = await geocodingData.json();

            if (geocoding.results?.[0]?.geometry?.location) {
              const trimmedLat = geocoding.results[0].geometry.location.lat.toString().split('.');
              finalLat = parseFloat(trimmedLat[0] + '.' + trimmedLat[1].slice(0, 6));
              const trimmedLng = geocoding.results[0].geometry.location.lng.toString().split('.');
              finalLng = parseFloat(trimmedLng[0] + '.' + trimmedLng[1].slice(0, 6));
              console.log('Using geocoded coordinates:', finalLat, finalLng);
            } else {
              console.log('Using provided coordinates:', finalLat, finalLng);
            }

            // Get nearby places
            const nearbyResponse = await fetch(
              `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${finalLat},${finalLng}&category=${type}&radius=${radius}&language=en&key=${apiKey}`,
              {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'origin': 'https://mplx.local',
                  'referer': 'https://mplx.local',
                },
              }
            );

            if (!nearbyResponse.ok) {
              throw new Error(`Nearby search failed: ${nearbyResponse.status}`);
            }

            const nearbyData = await nearbyResponse.json();

            if (!nearbyData.data || nearbyData.data.length === 0) {
              console.log('No nearby places found');
              return {
                results: [],
                center: { lat: finalLat, lng: finalLng }
              };
            }

            // Process each place
            const detailedPlaces = await Promise.all(
              nearbyData.data.map(async (place: any) => {
                try {
                  if (!place.location_id) {
                    console.log(`Skipping place "${place.name}": No location_id`);
                    return null;
                  }

                  // Fetch place details
                  const detailsResponse = await fetch(
                    `https://api.content.tripadvisor.com/api/v1/location/${place.location_id}/details?language=en&currency=USD&key=${apiKey}`,
                    {
                      method: 'GET',
                      headers: {
                        'Accept': 'application/json',
                        'origin': 'https://mplx.local',
                        'referer': 'https://mplx.local',
                      },
                    }
                  );

                  if (!detailsResponse.ok) {
                    console.log(`Failed to fetch details for "${place.name}"`);
                    return null;
                  }

                  const details = await detailsResponse.json();

                  console.log(`Place details for "${place.name}":`, details);

                  // Fetch place photos
                  let photos = [];
                  try {
                    const photosResponse = await fetch(
                      `https://api.content.tripadvisor.com/api/v1/location/${place.location_id}/photos?language=en&key=${apiKey}`,
                      {
                        method: 'GET',
                        headers: {
                          'Accept': 'application/json',
                          'origin': 'https://mplx.local',
                          'referer': 'https://mplx.local',
                        },
                      }
                    );

                    if (photosResponse.ok) {
                      const photosData = await photosResponse.json();
                      photos = photosData.data?.map((photo: any) => ({
                        thumbnail: photo.images?.thumbnail?.url,
                        small: photo.images?.small?.url,
                        medium: photo.images?.medium?.url,
                        large: photo.images?.large?.url,
                        original: photo.images?.original?.url,
                        caption: photo.caption
                      })).filter((photo: any) => photo.medium) || [];
                    }
                  } catch (error) {
                    console.log(`Photo fetch failed for "${place.name}":`, error);
                  }



                  // Get timezone for the location
                  const tzResponse = await fetch(
                    `https://maps.googleapis.com/maps/api/timezone/json?location=${details.latitude},${details.longitude}&timestamp=${Math.floor(Date.now() / 1000)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
                  );
                  const tzData = await tzResponse.json();
                  const timezone = tzData.timeZoneId || 'UTC';

                  // Process hours and status with timezone
                  const localTime = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
                  const currentDay = localTime.getDay();
                  const currentHour = localTime.getHours();
                  const currentMinute = localTime.getMinutes();
                  const currentTime = currentHour * 100 + currentMinute;

                  let is_closed = true;
                  let next_open_close = null;
                  let next_day = currentDay;

                  if (details.hours?.periods) {
                    // Sort periods by day and time for proper handling of overnight hours
                    const sortedPeriods = [...details.hours.periods].sort((a, b) => {
                      if (a.open.day !== b.open.day) return a.open.day - b.open.day;
                      return parseInt(a.open.time) - parseInt(b.open.time);
                    });

                    // Find current or next opening period
                    for (let i = 0; i < sortedPeriods.length; i++) {
                      const period = sortedPeriods[i];
                      const openTime = parseInt(period.open.time);
                      const closeTime = period.close ? parseInt(period.close.time) : 2359;
                      const periodDay = period.open.day;

                      // Handle overnight hours
                      if (closeTime < openTime) {
                        // Place is open from previous day
                        if (currentDay === periodDay && currentTime < closeTime) {
                          is_closed = false;
                          next_open_close = period.close.time;
                          break;
                        }
                        // Place is open today and extends to tomorrow
                        if (currentDay === periodDay && currentTime >= openTime) {
                          is_closed = false;
                          next_open_close = period.close.time;
                          next_day = (periodDay + 1) % 7;
                          break;
                        }
                      } else {
                        // Normal hours within same day
                        if (currentDay === periodDay && currentTime >= openTime && currentTime < closeTime) {
                          is_closed = false;
                          next_open_close = period.close.time;
                          break;
                        }
                      }

                      // Find next opening time if currently closed
                      if (is_closed) {
                        if ((periodDay > currentDay) || (periodDay === currentDay && openTime > currentTime)) {
                          next_open_close = period.open.time;
                          next_day = periodDay;
                          break;
                        }
                      }
                    }
                  }

                  // Return processed place data
                  return {
                    name: place.name || 'Unnamed Place',
                    location: {
                      lat: parseFloat(details.latitude || place.latitude || finalLat),
                      lng: parseFloat(details.longitude || place.longitude || finalLng)
                    },
                    timezone,
                    place_id: place.location_id,
                    vicinity: place.address_obj?.address_string || '',
                    distance: parseFloat(place.distance || '0'),
                    bearing: place.bearing || '',
                    type: type,
                    rating: parseFloat(details.rating || '0'),
                    price_level: details.price_level || '',
                    cuisine: details.cuisine?.[0]?.name || '',
                    description: details.description || '',
                    phone: details.phone || '',
                    website: details.website || '',
                    reviews_count: parseInt(details.num_reviews || '0'),
                    is_closed,
                    hours: details.hours?.weekday_text || [],
                    next_open_close,
                    next_day,
                    periods: details.hours?.periods || [],
                    photos,
                    source: details.source?.name || 'TripAdvisor'
                  };
                } catch (error) {
                  console.log(`Failed to process place "${place.name}":`, error);
                  return null;
                }
              })
            );

            // Filter and sort results
            const validPlaces = detailedPlaces
              .filter(place => place !== null)
              .sort((a, b) => (a?.distance || 0) - (b?.distance || 0));

            return {
              results: validPlaces,
              center: { lat: finalLat, lng: finalLng }
            };

          } catch (error) {
            console.error('Nearby search error:', error);
            throw error;
          }
        },
      }),
    },
    onChunk(event) {
      if (event.chunk.type === "tool-call") {
        console.log("Called Tool: ", event.chunk.toolName);
      }
    },
    onStepFinish(event) {
      if (event.warnings) {
        console.log("Warnings: ", event.warnings);
      }
    },
    onFinish(event) {
      console.log("Fin reason: ", event.finishReason);
      console.log("Steps ", event.steps);
      console.log("Messages: ", event.response.messages[event.response.messages.length - 1].content);
    },
  });

  return result.toDataStreamResponse();
}