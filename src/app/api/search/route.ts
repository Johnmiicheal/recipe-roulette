import Exa from "exa-js";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405,
      headers: {
        Allow: "POST",
      },
    });
  }

  try {
    const { query, no_of_results = 5 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: query" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const exa = new Exa(process.env.EXA_API_KEY as string);

    const searchResult = await exa.search(query, {
      type: "keyword",
      numResults: no_of_results,
      includeDomains: ["youtube.com"],
    });

    return new Response(
      JSON.stringify({ results: searchResult.results }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("YouTube search error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
