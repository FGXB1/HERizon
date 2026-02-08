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
  kick: 'bg-music-primary',
  snare: 'bg-music-secondary',
  hihat: 'bg-music-accent',
  clap: 'bg-music-dark',
  synth: 'bg-indigo-500',
  piano: 'bg-blue-500',
  bass: 'bg-purple-900',
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
      "flex flex-col gap-3 p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-music-light/10 transition-all duration-500",
    )}>
      {/* Header */}
      <div className="flex gap-4 items-center mb-2">
         <div className="w-20 text-xs font-bold text-music-light opacity-50 text-right shrink-0"></div>
         <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
           {Array.from({ length: 16 }).map((_, i) => {
              const isColHighlighted = highlightColumns?.includes(i);
              return (
                <div key={i} className={cn(
                  "text-[10px] text-center text-music-light transition-all duration-300",
                  i % 4 === 0 && "font-bold",
                  isColHighlighted && "text-music-primary font-bold scale-125 z-50 relative animate-bounce"
                )}>
                    {i + 1}
                </div>
              );
           })}
         </div>
      </div>

      {/* Rows */}
      {Object.entries(tracks).map(([trackName, steps]) => {
        const isRowHighlighted = highlightRow === trackName;

        return (
          <div key={trackName} className={cn(
            "flex gap-4 items-center transition-all duration-500 rounded-lg p-1 -m-1",
            isRowHighlighted ? "bg-white/10 z-50 relative scale-[1.02] shadow-xl ring-1 ring-music-primary" : ""
          )}>
            <div className={cn(
              "w-20 text-sm font-bold text-music-light capitalize text-right shrink-0 transition-colors",
              isRowHighlighted && "text-white"
            )}>
              {trackNames[trackName] || trackName}
            </div>
            <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
              {steps.map((isActive, stepIndex) => {
                const isColHighlighted = highlightColumns?.includes(stepIndex) && isRowHighlighted;

                return (
                  <button
                    key={stepIndex}
                    onClick={() => isInteractive && onToggleStep(trackName, stepIndex)}
                    disabled={!isInteractive}
                    className={cn(
                      "w-full aspect-square rounded-sm transition-all duration-200 border border-white/5",
                      isActive
                        ? (trackColors[trackName] || 'bg-music-primary') + " shadow-[0_0_8px_currentColor]"
                        : "bg-music-light/10 hover:bg-music-light/30",
                      currentStep === stepIndex && "ring-1 ring-white ring-offset-1 ring-offset-transparent transform scale-105 z-10",
                      stepIndex % 4 === 0 && !isActive && "bg-music-light/20",
                      isColHighlighted && !isActive && "bg-music-primary/50 animate-pulse ring-2 ring-music-primary", // Prompt to click
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
