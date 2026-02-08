"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FEATURED_INDUSTRIES, INDUSTRIES, type IndustryCategory } from "@/lib/content/industries";

const CATEGORIES: IndustryCategory[] = ["Creative", "Engineering", "Business", "Science", "Social Impact"];

function emit(trigger: string) {
  window.dispatchEvent(new CustomEvent("herizon:mentor", { detail: { trigger } }));
}

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demo = searchParams.get("demo") === "1";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<IndustryCategory | "All">("All");

  useEffect(() => emit("EXPLORE_ENTER"), []);

  useEffect(() => {
    if (!demo) return;
    const t = window.setTimeout(() => {
      router.push("/industry/music-production?demo=1");
    }, 1700);
    return () => window.clearTimeout(t);
  }, [demo, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INDUSTRIES.filter((i) => {
      if (category !== "All" && i.category !== category) return false;
      if (!q) return true;
      return (
        i.name.toLowerCase().includes(q) ||
        i.shortBlurb.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {demo && (
        <div className="rounded-2xl border border-music-primary/25 bg-music-primary/10 p-4 text-sm text-white/85">
          <div className="font-semibold">Demo Mode</div>
          <div className="mt-1 text-white/70">
            Auto-running the guided tour. Next: Music Production.
          </div>
        </div>
      )}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Industry Universe</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
              Explore first. You don’t have to complete every module. Pick one world that feels interesting today, then
              try a featured 5-minute simulation if you want.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 md:w-[360px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search industries, tags, skills…"
                className="h-11 pl-10 bg-black/20"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="mr-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/60">
            <Filter className="h-4 w-4" /> Filter
          </div>
          <button
            type="button"
            onClick={() => setCategory("All")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition",
              category === "All"
                ? "border-music-primary/40 bg-music-primary/15 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition",
                category === c
                  ? "border-music-primary/40 bg-music-primary/15 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Featured Exhibits</h3>
            <p className="mt-1 text-sm text-white/60">Try one 5-minute simulation. No pressure to do all three.</p>
          </div>
          <Badge variant="brand" className="hidden sm:inline-flex">
            3 demos
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURED_INDUSTRIES.map((i) => (
            <div
              key={i.slug}
              className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur transition hover:bg-black/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold">{i.name}</div>
                  <div className="mt-2 text-sm text-white/70">{i.shortBlurb}</div>
                </div>
                <Badge variant="brand">Featured</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {i.tags.slice(0, 4).map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-2">
                <Button asChild className="bg-music-primary text-white hover:bg-music-secondary">
                  <Link href={`/industry/${i.slug}`}>Open</Link>
                </Button>
                {i.demoRoute && (
                  <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                    <Link href={i.demoRoute}>Try</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">All Industries</h3>
            <p className="mt-1 text-sm text-white/60">
              Tap any card for a first glimpse, stories, and next steps.
            </p>
          </div>
          <div className="text-xs text-white/50">{filtered.length} shown</div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((i) => (
            <Link
              key={i.slug}
              href={`/industry/${i.slug}`}
              className="group rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-base font-semibold text-white">{i.name}</div>
                {i.featuredDemo ? (
                  <Badge variant="brand">Demo</Badge>
                ) : i.beginnerFriendly ? (
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Beginner</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Explore</span>
                )}
              </div>
              <div className="mt-2 text-sm text-white/70">{i.shortBlurb}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {i.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[11px] text-white/65"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
