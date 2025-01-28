import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const groq_sdk = new Groq({ apiKey: process.env.GROQ_API_KEY });

    if (req.method !== "POST") {
      return NextResponse.json(
        { error: `Method ${req.method} Not Allowed` },
        { status: 405 }
      );
    }

    const body = await req.json();
    const { context } = body;

    if (!context) {
      return NextResponse.json(
        { error: "Missing required parameters: context" },
        { status: 400 }
      );
    }

    const prompt = `Based on the current discussion, generate short 3-4 relevant follow-up questions about cooking techniques, variations, or related recipes. Context: ${context} Do not yap or explain further, just generate the very short questions.`;

    const response = await groq_sdk.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a culinary expert generating relevant follow-up questions about cooking and recipes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.7,
      max_tokens: 200,
    });

    const suggestions = response.choices[0].message.content
      ?.split("\n")
      .filter((q) => q.trim());

    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error) {
    console.error("Suggested questions generation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
