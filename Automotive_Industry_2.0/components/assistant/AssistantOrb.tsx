"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Mic, MicOff, Send, Volume2, VolumeX, Sparkles } from "lucide-react";

import { VoicePoweredOrb } from "@/components/ui/voice-powered-orb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { INDUSTRIES } from "@/lib/content/industries";
import { canPlayLine, markLinePlayed, pickMentorLine, type VoiceStyle } from "@/lib/mentor/mentorEngine";

type Msg = { id: string; role: "user" | "mentor"; text: string };

const LS = {
  speak: "herizon:mentor-speak",
  mute: "herizon:mentor-mute",
  voiceStyle: "herizon:mentor-style",
} as const;

function getLS(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  return v ?? fallback;
}

function setLS(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function guessIndustryFromPath(pathname: string) {
  const m = pathname.match(/^\/industry\/([^/]+)/);
  if (!m) return null;
  const slug = decodeURIComponent(m[1]);
  return INDUSTRIES.find((i) => i.slug === slug) ?? null;
}

function suggestionChips(pathname: string) {
  if (pathname.startsWith("/explore")) {
    return [
      "Recommend 3 industries for me",
      "What does a 'producer' do?",
      "How do I know what I’ll like?",
    ];
  }
  if (pathname.startsWith("/industry/")) {
    return [
      "Give me a 60-second overview",
      "What skills matter most?",
      "What can I try this week?",
    ];
  }
  if (pathname.startsWith("/labs/music")) {
    return ["Give me a confident beat pattern", "Explain reverb vs echo", "What should I try next?"];
  }
  if (pathname.startsWith("/labs/pitstop")) {
    return ["When should I pit?", "What stat should I watch first?", "Explain tire wear simply"];
  }
  if (pathname.startsWith("/labs/dealroom")) {
    return ["Explain debt vs equity", "How do I negotiate confidently?", "Summarize what I learned"];
  }
  return ["What should I do next?", "Give me a quick tip", "Explain this page"];
}

async function playTts(text: string, voiceStyle: VoiceStyle) {
  const res = await fetch("/api/mentor/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voiceStyle }),
  });
  if (!res.ok) throw new Error(`TTS failed: ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.volume = 1;
  await audio.play();
  audio.addEventListener("ended", () => URL.revokeObjectURL(url), { once: true });
}

export function AssistantOrb() {
  const pathname = usePathname() || "/";
  const industry = useMemo(() => guessIndustryFromPath(pathname), [pathname]);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: uid(),
      role: "mentor",
      text: "Ask me anything. I’ll keep it simple and practical.",
    },
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(false);

  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>("direct");

  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load toggles once on mount.
    setSpeakEnabled(getLS(LS.speak, "false") === "true");
    setMuted(getLS(LS.mute, "false") === "true");
    const style = getLS(LS.voiceStyle, "direct") as VoiceStyle;
    setVoiceStyle(style === "calm" || style === "hype" || style === "direct" ? style : "direct");
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, open]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content) return;

      setMessages((prev) => [...prev, { id: uid(), role: "user", text: content }]);
      setInput("");
      setBusy(true);

      try {
        const apiMessages = [...messages, { id: "pending", role: "user" as const, text: content }]
          .slice(-12)
          .map((m) => ({
            role: m.role === "mentor" ? "assistant" : "user",
            content: m.text,
          }));

        const res = await fetch("/api/assistant/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            context: {
              path: pathname,
              industrySlug: industry?.slug,
              industryName: industry?.name,
            },
          }),
        });

        if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
        const data = (await res.json()) as { text?: string };
        const reply = (data.text ?? "").toString().trim() || "I’m here. Try asking in one sentence.";

        setMessages((prev) => [...prev, { id: uid(), role: "mentor", text: reply }]);

        if (speakEnabled && !muted) {
          // Fire and forget; do not block UI on audio.
          void playTts(reply, voiceStyle).catch(() => {});
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "mentor",
            text: "I couldn’t reach the assistant API. If you set `GEMINI_API_KEY`, I’ll answer here.",
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [industry?.name, industry?.slug, messages, muted, pathname, speakEnabled, voiceStyle],
  );

  // Event-driven mentor scripts (pages can emit triggers without importing this component).
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<any>;
      const detail = ce.detail ?? {};

      const trigger = (detail.trigger ?? "").toString();
      if (!trigger) return;

      const line = pickMentorLine({
        trigger,
        voiceStyle: (detail.voiceStyle as VoiceStyle) ?? voiceStyle,
        vars: detail.vars ?? {},
      });
      if (!line) return;
      if (!canPlayLine(line.id, line.cooldownMs)) return;
      markLinePlayed(line.id);

      setMessages((prev) => [...prev, { id: uid(), role: "mentor", text: line.text }]);
      if (speakEnabled && !muted) {
        void playTts(line.text, line.voice).catch(() => {});
      }
    };

    window.addEventListener("herizon:mentor", handler as any);
    return () => window.removeEventListener("herizon:mentor", handler as any);
  }, [muted, speakEnabled, voiceStyle]);

  const chips = useMemo(() => suggestionChips(pathname), [pathname]);

  const toggleSpeak = () => {
    setSpeakEnabled((v) => {
      const next = !v;
      setLS(LS.speak, next ? "true" : "false");
      return next;
    });
  };

  const toggleMute = () => {
    setMuted((v) => {
      const next = !v;
      setLS(LS.mute, next ? "true" : "false");
      return next;
    });
  };

  const toggleRecording = () => {
    // Optional: Web Speech API transcription if available.
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "mentor", text: "Voice input isn’t supported in this browser. Type your question instead." },
      ]);
      setIsRecording(false);
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    setIsRecording(true);

    rec.onresult = (evt: any) => {
      const t = evt?.results?.[0]?.[0]?.transcript ?? "";
      setIsRecording(false);
      if (t) void send(String(t));
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);
    rec.start();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "group flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-sm text-white shadow-2xl backdrop-blur-md transition hover:bg-black/55",
          )}
          aria-label="Open assistant"
        >
          <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-black/50">
            <VoicePoweredOrb
              enableVoiceControl={false}
              className="h-full w-full"
              hue={320}
            />
            <span
              className={cn(
                "pointer-events-none absolute inset-0 rounded-full ring-2 ring-transparent",
                voiceDetected ? "ring-music-primary/70" : "",
              )}
            />
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[11px] uppercase tracking-wider text-white/60">Mentor</span>
            <span className="font-semibold">Ask me</span>
          </span>
        </button>
      )}

      {open && (
        <div className="w-[360px] max-w-[90vw] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/85 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-black/50">
                <VoicePoweredOrb
                  enableVoiceControl={isRecording}
                  className="h-full w-full"
                  hue={320}
                  onVoiceDetected={setVoiceDetected}
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Herizon Mentor</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
                    <Sparkles className="h-3 w-3" /> Gemini
                  </span>
                </div>
                <div className="text-[11px] text-white/60">
                  {industry ? industry.name : "Guidance anywhere"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white/70 hover:text-white"
                onClick={toggleSpeak}
                aria-label={speakEnabled ? "Disable voice" : "Enable voice"}
              >
                <Volume2 className={cn("h-4 w-4", speakEnabled ? "opacity-100" : "opacity-40")} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white/70 hover:text-white"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                <VolumeX className={cn("h-4 w-4", muted ? "opacity-100" : "opacity-40")} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white/70 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
              >
                <span className="text-lg leading-none">×</span>
              </Button>
            </div>
          </div>

          <div ref={listRef} className="max-h-[46vh] space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto max-w-[85%] bg-music-primary/20 text-white"
                    : "mr-auto max-w-[90%] bg-white/5 text-white/90",
                )}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setInput(c)}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 hover:bg-white/10"
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn(
                  "h-10 w-10 border-white/10 bg-white/5 text-white hover:bg-white/10",
                  isRecording ? "ring-2 ring-music-primary/70" : "",
                )}
                onClick={toggleRecording}
                aria-label={isRecording ? "Stop listening" : "Start voice input"}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <form
                className="flex flex-1 items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(input);
                }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  className="h-10 bg-white/5 text-white placeholder:text-white/40"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 w-10 bg-music-primary text-white hover:bg-music-secondary"
                  disabled={busy}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
