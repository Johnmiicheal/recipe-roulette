import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import Exa from "exa-js";

export const maxDuration = 30;

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY!,
});

const youtubeSearchTool = tool({
  description:
    "Search YouTube videos using Exa AI and get detailed video information based on cooking recipes using context provided from the user's input.",
  parameters: z.object({
    query: z
      .string()
      .describe(
        "The search query for YouTube Cooking Recipe videos. The videos must relate to what the user has asked."
      ),
    no_of_results: z
      .number()
      .default(5)
      .describe("The number of results to return"),
  }),
  execute: async ({
    query,
    no_of_results,
  }: {
    query: string;
    no_of_results: number;
  }) => {
    try {
      const exa = new Exa(process.env.EXA_API_KEY as string);
      const searchResult = await exa.search(query, {
        type: "keyword",
        numResults: no_of_results,
        includeDomains: ["youtube.com"],
      });
      return {
        results: searchResult,
      };
    } catch (error) {
      console.error("YouTube search error:", error);
      throw error;
    }
  },
});

export async function POST(req: Request) {
  const {
    messages,
    model = "llama-3.3-70b-versatile",
    temperature = 0.5,
  } = await req.json();

  const systemPrompt = `
    You are a cooking recipe search engine query/questions generator called Tabetai. 
    You are created to help students find recipes. 
    **NON NEGOTIABLE** Always provide recipes based on the user's input no matter what tool you are calling. 
    **NON NEGOTIABLE** Always call the tool after generating the recipe.
    Your first objective is to provide the recipe.
    Your second objective is to call the youtube_search tool to get more information about the recipe.
    Do not complete the task until you have completed both objectives
    Always provide recipes before making any tool calls.
    The current date is ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", weekday: "short" })}.
    Do not provide view counts, publish dates, or video thumbnails.
    Always add question suggestions after you have replied to the user's initial question. Use the header 'Suggested questions' before the questions.
    Always put the user input's context in some way so that the next search knows what to search for exactly.
  `;

  const result = streamText({
    model: groq(model),
    system: systemPrompt,
    messages,
    temperature,
    tools: {
      youtube_search: youtubeSearchTool,
    },
    onChunk(event) {
      if (event.chunk.type === "text-delta") {
        console.log("Generated Text: ", event.chunk.textDelta);
      } else if (event.chunk.type === "tool-call") {
        console.log("Called Tool: ", event.chunk.toolName);
      }
    },
    onStepFinish(event) {
      if (event.warnings) {
        console.log("Warnings: ", event.warnings);
      }
    },
    onFinish(event) {
      console.log("Finish Reason: ", event.finishReason);
      console.log("Steps: ", event.steps);
      console.log(
        "Final Message: ",
        event.response.messages[event.response.messages.length - 1].content
      );
    },
  });

  return result.toDataStreamResponse();
}