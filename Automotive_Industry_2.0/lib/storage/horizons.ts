type Stamp = {
  glimpsed?: boolean;
  demoCompleted?: boolean;
};

const LS_KEYS = {
  saved: "herizon:saved-industries",
  stamps: "herizon:stamps",
  letters: "herizon:letters",
} as const;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function hasWindow() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSavedIndustries(): string[] {
  if (!hasWindow()) return [];
  const v = safeParse<string[]>(window.localStorage.getItem(LS_KEYS.saved), []);
  return Array.isArray(v) ? v : [];
}

export function toggleSavedIndustry(slug: string): string[] {
  if (!hasWindow()) return [];
  const current = new Set(getSavedIndustries());
  if (current.has(slug)) current.delete(slug);
  else current.add(slug);
  const next = Array.from(current);
  window.localStorage.setItem(LS_KEYS.saved, JSON.stringify(next));
  return next;
}

export function getStamps(): Record<string, Stamp> {
  if (!hasWindow()) return {};
  const v = safeParse<Record<string, Stamp>>(window.localStorage.getItem(LS_KEYS.stamps), {});
  return v && typeof v === "object" ? v : {};
}

function setStamp(slug: string, patch: Stamp) {
  if (!hasWindow()) return;
  const stamps = getStamps();
  stamps[slug] = { ...(stamps[slug] ?? {}), ...patch };
  window.localStorage.setItem(LS_KEYS.stamps, JSON.stringify(stamps));
}

export function markGlimpse(slug: string) {
  setStamp(slug, { glimpsed: true });
}

export function markDemoCompleted(slug: string) {
  setStamp(slug, { demoCompleted: true });
}

type Letter = { text: string; createdAt: string };

export function saveLetter(slug: string, text: string) {
  if (!hasWindow()) return;
  const letters = getLetters();
  letters[slug] = { text, createdAt: new Date().toISOString() };
  window.localStorage.setItem(LS_KEYS.letters, JSON.stringify(letters));
}

export function getLetters(): Record<string, Letter> {
  if (!hasWindow()) return {};
  const v = safeParse<Record<string, Letter>>(window.localStorage.getItem(LS_KEYS.letters), {});
  return v && typeof v === "object" ? v : {};
}

