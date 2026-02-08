import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-neutral-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="group flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-music-primary via-music-secondary to-music-accent shadow-[0_0_25px_rgba(209,102,102,0.25)]" />
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">HERizon</div>
              <div className="text-[10px] text-white/60">Explore-first</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 sm:flex">
            <Link href="/explore" className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">
              Explore
            </Link>
            <Link
              href="/my-horizons"
              className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
            >
              My Horizons
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              <Link href="/explore?demo=1">Run Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="pb-24">{children}</div>
    </div>
  );
}
