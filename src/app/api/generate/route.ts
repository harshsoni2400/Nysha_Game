import OpenAI from "openai";
import { getQuestionPrompt, getWordPrompt, parseGeneratedQuestions, parseGeneratedWords } from "@/lib/openai";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { type, subject, count = 10 } = body;

  const openai = new OpenAI({ apiKey });

  try {
    let prompt: string;
    if (type === "questions") {
      prompt = getQuestionPrompt(subject || "mixed", count);
    } else if (type === "words") {
      prompt = getWordPrompt(count);
    } else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const text = completion.choices[0]?.message?.content || "";

    if (type === "questions") {
      const questions = parseGeneratedQuestions(text);
      return Response.json({ questions });
    } else {
      const words = parseGeneratedWords(text);
      return Response.json({ words });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
