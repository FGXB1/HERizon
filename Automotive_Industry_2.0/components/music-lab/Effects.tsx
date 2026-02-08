import React from "react";
import { Activity, Sparkles, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";

interface EffectsProps {
  effects: {
    reverb: boolean;
    delay: boolean;
    distortion: boolean;
  };
  reverbMix: number;
  onToggleEffect: (effect: "reverb" | "delay" | "distortion", active: boolean) => void;
  onReverbMixChange: (value: number) => void;
  isHighlighted?: boolean;
}

export function Effects({
  effects,
  reverbMix,
  onToggleEffect,
  onReverbMixChange,
  isHighlighted,
}: EffectsProps) {
  return (
    <Card
      className={cn(
        "rounded-xl border border-music-light/10 bg-music-dark/50 p-4 text-white backdrop-blur-md transition-all duration-500",
        isHighlighted
          ? "relative z-50 bg-music-dark ring-2 ring-music-primary shadow-[0_0_30px_rgba(209,102,102,0.3)]"
          : "",
      )}
    >
      <div className="flex flex-col gap-4">
        <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-music-light">Effects Rack</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Toggle
              pressed={effects.reverb}
              onPressedChange={(active) => onToggleEffect("reverb", active)}
              className="h-8 border border-transparent bg-white/10 text-xs text-music-light transition-all data-[state=on]:bg-music-primary data-[state=on]:text-white data-[state=on]:shadow-[0_0_10px_rgba(209,102,102,0.5)]"
            >
              <Sparkles className="mr-2 h-3 w-3" />
              Reverb
            </Toggle>
            <span className="font-mono text-xs text-music-light">{Math.round(reverbMix)}%</span>
          </div>
          <Slider
            disabled={!effects.reverb}
            value={[reverbMix]}
            max={100}
            step={1}
            onValueChange={(vals) => onReverbMixChange(vals[0])}
            className={cn("cursor-pointer", !effects.reverb && "opacity-50")}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Toggle
            pressed={effects.delay}
            onPressedChange={(active) => onToggleEffect("delay", active)}
            className="h-8 flex-1 border border-transparent bg-white/10 text-xs text-music-light transition-all data-[state=on]:bg-music-secondary data-[state=on]:text-white data-[state=on]:shadow-[0_0_10px_rgba(85,12,24,0.5)]"
          >
            <Activity className="mr-2 h-3 w-3" />
            Echo
          </Toggle>

          <Toggle
            pressed={effects.distortion}
            onPressedChange={(active) => onToggleEffect("distortion", active)}
            className="h-8 flex-1 border border-transparent bg-white/10 text-xs text-music-light transition-all data-[state=on]:bg-music-accent data-[state=on]:text-white data-[state=on]:shadow-[0_0_10px_rgba(36,1,21,0.5)]"
          >
            <Zap className="mr-2 h-3 w-3" />
            Grit
          </Toggle>
        </div>
      </div>
    </Card>
  );
}

