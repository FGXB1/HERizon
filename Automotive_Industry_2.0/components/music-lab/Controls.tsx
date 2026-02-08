import React from "react";
import { Play, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
}

export function Controls({ isPlaying, onTogglePlay, tempo, onTempoChange }: ControlsProps) {
  return (
    <div className="flex items-center gap-6 rounded-xl border border-music-light/10 bg-music-dark/50 p-4 text-white backdrop-blur-md">
      <Button
        onClick={onTogglePlay}
        variant="outline"
        size="lg"
        className="h-16 w-16 rounded-full border-2 border-music-primary text-music-primary transition-all shadow-[0_0_15px_rgba(209,102,102,0.3)] hover:bg-music-primary hover:text-white"
      >
        {isPlaying ? <Square className="fill-current" /> : <Play className="ml-1 fill-current" />}
      </Button>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-between text-sm font-medium text-music-light">
          <span>Tempo</span>
          <span className="font-bold text-music-primary">{tempo} BPM</span>
        </div>
        <Slider
          value={[tempo]}
          min={60}
          max={180}
          step={1}
          onValueChange={(vals) => onTempoChange(vals[0])}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}

