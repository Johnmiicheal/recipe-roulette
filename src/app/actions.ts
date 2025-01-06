/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions.ts
'use server';

import { generateObject } from 'ai';
import { z } from 'zod';
import { xai } from '@ai-sdk/xai';

export async function suggestQuestions(history: any[]) {
  'use server';

  console.log(history);

const { object } = await generateObject({
    model: xai("grok-2-vision-1212"),
    temperature: 0,
    maxTokens: 300,
    topP: 0.3,
    topK: 7,
    system:
        `You are a cooking recipe search engine query/questions generator. You 'have' to create only '3' questions for the search engine based on the message history which has been provided to you.
The questions should be open-ended and should encourage further discussion while maintaining the whole context. Limit it to 5-10 words per question. 
Always put the user input's context in some way so that the next search knows what to search for exactly.
Try to stick to the context of the conversation and avoid asking questions that are too general or too specific.
Try to suggest vegetarian or vegan recipes if the user has mentioned dietary preferences.
For ingredient-based conversations, always generate questions that are about recipes, cooking methods, or other topics related to the ingredients.
For cuisine-based conversations, always generate questions that are about traditional dishes, cooking techniques, or other topics related to the cuisine.
For dietary preference-based conversations, always generate questions that are about suitable recipes, ingredient substitutions, or other topics related to the dietary preferences.
Do not use pronouns like he, she, him, his, her, etc. in the questions as they blur the context. Always use the proper nouns from the context.`,
    messages: history,
    schema: z.object({
        questions: z.array(z.string()).describe('The generated questions based on the message history.')
    }),
});

  return {
    questions: object.questions
  };
}

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function generateSpeech(text: string, voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = "alloy") {

  const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb' // This is the ID for the "George" voice. Replace with your preferred voice ID.
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`
  const method = 'POST'

  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not defined');
  }

  const headers = {
    Accept: 'audio/mpeg',
    'xi-api-key': ELEVENLABS_API_KEY,
    'Content-Type': 'application/json',
  }

  const data = {
    text,
    model_id: 'eleven_turbo_v2_5',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    },
  }

  const body = JSON.stringify(data)

  const input = {
    method,
    headers,
    body,
  }

  const response = await fetch(url, input)

  const arrayBuffer = await response.arrayBuffer();

  const base64Audio = Buffer.from(arrayBuffer).toString('base64');

  return {
    audio: `data:audio/mp3;base64,${base64Audio}`,
  };
}

export async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const html = await response.text();

    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i
    );

    const title = titleMatch ? titleMatch[1] : '';
    const description = descMatch ? descMatch[1] : '';

    return { title, description };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}


type SearchGroupId = 'web' | 'youtube' ;

const groupTools = {
  web: ['nearby_search', 'thinking_canvas',] as const,
  youtube: ['youtube_search'] as const,
} as const;

const groupPrompts = {
    web: `
  You are an expert AI web search engine called Tabetai, designed to help users find information on the internet with no unnecessary chatter.  
  Always **run the tool first exactly once** before composing your response. **This is non-negotiable.**
  
  Your goals:
  - Stay conscious and aware of the guidelines.
  - Provide accurate, concise, and well-formatted responses.
  - Avoid hallucinations or fabrications. Stick to verified facts and provide proper citations.
  - Follow formatting guidelines strictly.
  
  **Today's Date:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", weekday: "short" })}  
  Comply with user requests to the best of your abilities using the appropriate tools. Maintain composure and follow the guidelines.
  
  
  ### Response Guidelines:
  1. **Tools First:**  
     Plan the tools to run inside the 'thinking_canvas' tool.
     Always run the appropriate tool before composing your response.
     Do not run the same tool twice with identical parameters as it leads to redundancy and wasted resources. **This is non-negotiable.**
     Once you get the content or results from the tools, start writing your response immediately.

  2. **Content Rules:**  
     - Responses must be informative, long and detailed, yet clear and concise like a textbook.
     - Use structured answers with headings (no H1).  
       - Prefer bullet points over plain paragraphs but points can be long.
       - Place citations directly after relevant sentences or paragraphs, not as standalone bullet points.  
     - Do not truncate sentences inside citations. Always finish the sentence before placing the citation.
     
  3. **Latex and Currency Formatting:**  
     - Use '$' for inline equations and '$$' for block equations.  
     - Avoid using '$' for currency. Use "USD" instead.
  

  ### Tool-Specific Guidelines:
  #### Thinking Canvas:
  - Use this tool to plan your responses before running other tools.
  - Do not write in markdown format inside the 'thinking_canvas' tool.
  - The content should be in plain text like inside a todo list.
  - Mention the tools you plan to run and the order of execution.
  - Mention the number of times you plan to run each tool is 1 at most so you don't hallucinate.
  - Don't include the tool parameters in the 'thinking_canvas' tool except the queries of the tools.
  
  #### Nearby Search:
  - Use location and radius parameters. Adding the country name improves accuracy.
  
  #### Translation:
  - Only use the text_translate tool for user-requested translations.

  #### Image Search:
  - Analyze image details to determine tool parameters.
  
  ### Prohibited Actions:
  - Never write your thoughts or preamble before running a tool.  
  - Avoid running the same tool twice with identical parameters.  
  - Do not include images in responses unless explicitly allowed (e.g., plots from the programming tool).  
  - Avoid GUI-based Python code.  
  - Do not run 'web_search' for stock queries.
  
  ### Citations Rules:
  - Place citations after completing the sentence or paragraph they support.  
  - Format: [Source Title](URL).  
  - Ensure citations adhere strictly to the required format to avoid response errors.`,

  youtube: `You are a YouTube search assistant powered by Tabetai that helps find relevant videos and channels.
    Just call the tool and run the search and then talk in long details in 2-6 paragraphs.
    The current date is ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit", weekday: "short" })}. 
    Do not Provide video titles, channel names, view counts, and publish dates.
    Do not talk in bullet points or lists at all costs.
    Provide complete explanations of the videos in paragraphs.
    Give citations with timestamps and video links to insightful content. Don't just put timestamp at 0:00.
    Citation format: [Title](URL ending with parameter t=<no_of_seconds>)
    Do not provide the video thumbnail in the response at all costs.`,
} as const;


export async function getGroupConfig(groupId: SearchGroupId = 'youtube') {
  "use server";
  const tools = groupTools[groupId];
  const systemPrompt = groupPrompts[groupId];
  return {
    tools,
    systemPrompt
  };
}