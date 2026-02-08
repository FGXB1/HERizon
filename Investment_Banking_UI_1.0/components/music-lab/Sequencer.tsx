import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SequencerProps {
  tracks: { [key: string]: boolean[] };
  currentStep: number;
  onToggleStep: (track: string, step: number) => void;
  highlightRow?: string | null;
  highlightColumns?: number[];
  isInteractive?: boolean;
}

const trackColors: { [key: string]: string } = {
  kick: 'bg-[#D16666]',    // Primary Red
  snare: 'bg-[#C1C1C1]',   // Light Grey
  hihat: 'bg-[#FF9B9B]',   // Lighter Red/Pink
  clap: 'bg-[#6B8CA3]',    // Lighter Steel Blue
  synth: 'bg-[#E6A5A5]',   // Muted Salmon
  piano: 'bg-[#94A3B8]',   // Cool Grey
  bass: 'bg-[#B37D88]',    // Mauve
};

const trackNames: { [key: string]: string } = {
  kick: 'Kick',
  snare: 'Snare',
  hihat: 'Hi-Hat',
  clap: 'Clap',
  synth: 'Synth',
  piano: 'Piano',
  bass: 'Bass',
};

export function Sequencer({
  tracks,
  currentStep,
  onToggleStep,
  highlightRow,
  highlightColumns,
  isInteractive = true
}: SequencerProps) {

  return (
    <div className={cn(
      "flex flex-col gap-3 p-6 bg-music-dark/50 rounded-xl border border-music-light/10",
    )}>
      {/* Header */}
      <div className="flex gap-4 items-center mb-1">
        <div className="w-20 text-xs font-bold text-music-light opacity-50 text-right shrink-0"></div>
        <div className="flex-1 grid gap-1.5" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={cn(
              "text-[10px] text-center text-music-light",
              i % 4 === 0 && "font-bold"
            )}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      {Object.entries(tracks).map(([trackName, steps]) => {
        return (
          <div key={trackName} className="flex gap-4 items-center">
            <div className="w-20 text-sm font-bold text-music-light capitalize text-right shrink-0">
              {trackNames[trackName] || trackName}
            </div>
            <div className="flex-1 grid gap-1.5" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
              {steps.map((isActive, stepIndex) => {
                const isCurrent = currentStep === stepIndex;

                return (
                  <button
                    key={stepIndex}
                    onClick={() => isInteractive && onToggleStep(trackName, stepIndex)}
                    disabled={!isInteractive}
                    className={cn(
                      "w-full aspect-square rounded-[4px] transition-all duration-150",
                      // Base state (inactive)
                      !isActive && "bg-white/5 border border-white/10 hover:bg-white/10",
                      // Active state
                      isActive && "border-transparent",
                      isActive && (trackColors[trackName] || 'bg-music-primary'),
                      // Current step indicator (outline)
                      isCurrent && "ring-1 ring-white z-10",
                      !isInteractive && "cursor-not-allowed opacity-50"
                    )}
                    aria-label={`Toggle ${trackName} step ${stepIndex + 1}`}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
