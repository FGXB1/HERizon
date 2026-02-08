import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 501 });

  let body: { messages?: ChatMessage[]; context?: Record<string, any> } = {};
  try {
    body = (await req.json()) as any;
  } catch {
    // ignore
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const context = body.context ?? {};

  const system = [
    "You are Herizon, an empathetic, authoritative mentor voice for teen girls exploring industries.",
    "Be kind, confident, and practical. No fluff, no cringe.",
    "Never claim to be a therapist or provide medical/legal advice.",
    "Do not request personal identifying info. If user shares something heavy, respond supportive and suggest a trusted adult.",
    "Keep answers short: 3-6 sentences max. If giving steps, give at most 3 bullets.",
    "Use simple language (middle/high-school friendly).",
    "If you need to make an assumption, state it in one sentence.",
    `Context: current_path=${String(context.path ?? "")}, industry=${String(
      context.industryName ?? context.industrySlug ?? "",
    )}.`,
  ].join("\n");

  const prompt = [
    { role: "system", parts: [{ text: system }] },
    ...messages
      .filter((m) => m?.content && typeof m.content === "string")
      .slice(-12)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : m.role,
        parts: [{ text: m.content }],
      })),
  ];

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL_ID ?? "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: prompt as any,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 220,
      },
    });

    const text = result.response.text().trim();
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini chat error:", error?.message?.slice?.(0, 200) ?? error);
    return NextResponse.json({ error: "Gemini chat failed" }, { status: 500 });
  }
}

