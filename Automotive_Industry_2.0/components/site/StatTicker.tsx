"use client";

import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_STATS = [
  { label: "Music production", value: "2%", note: "of music producers are women (approx.)" },
  { label: "Confidence", value: "5 min", note: "to try one guided demo" },
  { label: "Your pace", value: "Explore-first", note: "no required sequence" },
];

export function StatTicker({ stats = DEFAULT_STATS }: { stats?: Array<{ label: string; value: string; note: string }> }) {
  const items = useMemo(() => (stats.length ? stats : DEFAULT_STATS), [stats]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setIdx((i) => (i + 1) % items.length), 2600);
    return () => window.clearInterval(t);
  }, [items.length]);

  const item = items[idx];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
      <div className="text-[10px] uppercase tracking-widest text-white/60">{item.label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-2xl font-bold text-white">{item.value}</div>
        <div className="text-sm text-white/70">{item.note}</div>
      </div>
    </div>
  );
}

