import scripts from "@/lib/content/mentor-scripts.json";

export type VoiceStyle = "calm" | "hype" | "direct";

export type MentorVars = Record<string, string | number | undefined | null>;

export type MentorScript = {
  id: string;
  voice: VoiceStyle;
  trigger: string;
  cooldownMs: number;
  priority?: number;
  text: string;
};

type MentorScriptLibrary = {
  meta: unknown;
  global?: MentorScript[];
  musicLab?: MentorScript[];
  pitStopLab?: MentorScript[];
  dealRoomLab?: MentorScript[];
};

const LIB = scripts as unknown as MentorScriptLibrary;

function renderTemplate(input: string, vars: MentorVars) {
  return input.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => {
    const v = vars[key];
    if (v === undefined || v === null) return "";
    return String(v);
  });
}

function byPriorityDesc(a: MentorScript, b: MentorScript) {
  return (b.priority ?? 0) - (a.priority ?? 0);
}

function collectAllScripts(): MentorScript[] {
  return [...(LIB.global ?? []), ...(LIB.musicLab ?? []), ...(LIB.pitStopLab ?? []), ...(LIB.dealRoomLab ?? [])];
}

export function pickMentorLine(params: {
  trigger: string;
  voiceStyle: VoiceStyle;
  vars?: MentorVars;
}): { id: string; voice: VoiceStyle; text: string; cooldownMs: number } | null {
  const { trigger, voiceStyle } = params;
  const vars = params.vars ?? {};

  const matches = collectAllScripts().filter((s) => s.trigger === trigger);
  if (matches.length === 0) return null;

  const byVoice = matches.filter((s) => s.voice === voiceStyle).sort(byPriorityDesc);
  const pool = byVoice.length ? byVoice : matches.sort(byPriorityDesc);

  const chosen = pool[0];
  return {
    id: chosen.id,
    voice: chosen.voice,
    cooldownMs: chosen.cooldownMs,
    text: renderTemplate(chosen.text, vars),
  };
}

// Basic cooldown tracker (client-only; safe no-op on server)
const CD_KEY = "herizon:mentor-cooldowns";

function nowMs() {
  return Date.now();
}

function hasWindow() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getCooldowns(): Record<string, number> {
  if (!hasWindow()) return {};
  try {
    const raw = window.localStorage.getItem(CD_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function setCooldowns(map: Record<string, number>) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(CD_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function canPlayLine(id: string, cooldownMs: number) {
  if (!hasWindow()) return true;
  const cds = getCooldowns();
  const last = cds[id] ?? 0;
  return nowMs() - last >= cooldownMs;
}

export function markLinePlayed(id: string) {
  if (!hasWindow()) return;
  const cds = getCooldowns();
  cds[id] = nowMs();
  setCooldowns(cds);
}

