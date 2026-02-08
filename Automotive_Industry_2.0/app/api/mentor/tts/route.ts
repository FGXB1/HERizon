import { NextResponse } from "next/server";

type VoiceStyle = "calm" | "hype" | "direct";

function pickVoiceId(style: VoiceStyle) {
  const direct = process.env.ELEVENLABS_VOICE_ID_DIRECT;
  const calm = process.env.ELEVENLABS_VOICE_ID_CALM;
  const hype = process.env.ELEVENLABS_VOICE_ID_HYPE;
  const fallback = process.env.ELEVENLABS_VOICE_ID;

  if (style === "direct" && direct) return direct;
  if (style === "calm" && calm) return calm;
  if (style === "hype" && hype) return hype;
  return fallback ?? null;
}

export async function POST(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ELEVENLABS_API_KEY" },
      { status: 501 },
    );
  }

  let body: { text?: string; voiceStyle?: VoiceStyle } = {};
  try {
    body = (await req.json()) as any;
  } catch {
    // ignore
  }

  const text = (body.text ?? "").toString().trim();
  const voiceStyle: VoiceStyle = (body.voiceStyle as VoiceStyle) ?? "direct";

  if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

  const voiceId = pickVoiceId(voiceStyle);
  if (!voiceId) {
    return NextResponse.json(
      { error: "Missing ELEVENLABS_VOICE_ID (or style-specific voice id env vars)" },
      { status: 501 },
    );
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

  const elevenRes = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  });

  if (!elevenRes.ok) {
    const errText = await elevenRes.text().catch(() => "");
    return NextResponse.json(
      { error: "ElevenLabs TTS failed", status: elevenRes.status, details: errText.slice(0, 800) },
      { status: 500 },
    );
  }

  const audio = new Uint8Array(await elevenRes.arrayBuffer());
  return new NextResponse(audio, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}

