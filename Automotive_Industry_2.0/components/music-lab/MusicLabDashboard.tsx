"use client";

import React, { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

import { AudioEngine } from "@/lib/audio-engine";
import { Button } from "@/components/ui/button";

import { Controls } from "./Controls";
import { Effects } from "./Effects";
import { RhythmCoach, type TutorialStep } from "./RhythmCoach";
import { Sequencer3D } from "./Sequencer3D";
import { Visualizer } from "./Visualizer";

export default function MusicLabDashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const [tutorialStep, setTutorialStep] = useState<TutorialStep | null>(null);

  const [tracks, setTracks] = useState<{ [key: string]: boolean[] }>({
    kick: new Array(16).fill(false),
    snare: new Array(16).fill(false),
    hihat: new Array(16).fill(false),
    clap: new Array(16).fill(false),
    synth: new Array(16).fill(false),
    piano: new Array(16).fill(false),
    bass: new Array(16).fill(false),
  });

  const [effects, setEffects] = useState({
    reverb: false,
    delay: false,
    distortion: false,
  });

  const [reverbMix, setReverbMix] = useState(0);

  const engineRef = useRef<AudioEngine | null>(null);

  // Load persistence & tutorial state
  useEffect(() => {
    const isComplete = localStorage.getItem("musicLabTutorialComplete");
    if (isComplete !== "true") setTutorialStep("intro");

    const savedState = localStorage.getItem("musicLabState");
    if (!savedState) return;
    try {
      const parsed = JSON.parse(savedState);
      if (parsed.tracks) setTracks(parsed.tracks);
      if (parsed.tempo) setTempo(parsed.tempo);
      if (parsed.effects) setEffects(parsed.effects);
      if (parsed.reverbMix !== undefined) setReverbMix(parsed.reverbMix);
    } catch (e) {
      console.error("Failed to parse musicLabState", e);
    }
  }, []);

  // Save persistence
  useEffect(() => {
    const state = { tracks, tempo, effects, reverbMix };
    localStorage.setItem("musicLabState", JSON.stringify(state));
  }, [tracks, tempo, effects, reverbMix]);

  // Sync state to AudioEngine
  useEffect(() => {
    if (!engineRef.current) return;
    engineRef.current.setTempo(tempo);
    Object.entries(effects).forEach(([effect, active]) => {
      engineRef.current!.setEffect(effect as any, active);
    });
    engineRef.current.setReverbMix(reverbMix / 100);
    Object.keys(tracks).forEach((key) => {
      tracks[key].forEach((active, step) => {
        engineRef.current!.setTrackStep(key, step, active);
      });
    });
  }, [tracks, tempo, effects, reverbMix]);

  useEffect(() => {
    engineRef.current = new AudioEngine();
    setAnalyser(engineRef.current.getAnalyser());
    engineRef.current.setOnStepCallback((step) => setCurrentStep(step));
    return () => engineRef.current?.stop();
  }, []);

  const handleTogglePlay = () => {
    if (!engineRef.current) return;
    const playing = engineRef.current.togglePlay();
    setIsPlaying(playing);
  };

  const handleToggleStep = (track: string, step: number) => {
    setTracks((prevTracks) => {
      const newTracks = { ...prevTracks };
      newTracks[track] = [...prevTracks[track]];
      newTracks[track][step] = !newTracks[track][step];
      return newTracks;
    });
  };

  const handleClear = () => {
    const clearedTracks = { ...tracks };
    Object.keys(clearedTracks).forEach((key) => {
      clearedTracks[key] = new Array(16).fill(false);
    });
    setTracks(clearedTracks);
  };

  const handleToggleEffect = (effect: "reverb" | "delay" | "distortion", active: boolean) => {
    setEffects((prev) => ({ ...prev, [effect]: active }));
  };

  const handleTutorialNext = (nextStep: TutorialStep) => {
    setTutorialStep(nextStep);
    if (nextStep === "complete") localStorage.setItem("musicLabTutorialComplete", "true");
  };
  const handleTutorialClose = () => {
    setTutorialStep(null);
    localStorage.setItem("musicLabTutorialComplete", "true");
  };
  const handleTutorialStart = () => setTutorialStep("kick");
  const resetTutorial = () => {
    setTutorialStep("intro");
    localStorage.removeItem("musicLabTutorialComplete");
  };

  // Highlighting guidance cues
  let highlightRow: string | null = null;
  let highlightColumns: number[] = [];
  let highlightEffects = false;

  if (tutorialStep === "kick") {
    highlightRow = "kick";
    highlightColumns = [0, 4, 8, 12];
  } else if (tutorialStep === "snare") {
    highlightRow = "snare";
    highlightColumns = [4, 12];
  } else if (tutorialStep === "hihat") {
    highlightRow = "hihat";
    highlightColumns = [2, 6, 10, 14];
  } else if (tutorialStep === "bass") {
    highlightRow = "bass";
    highlightColumns = [2, 6, 10, 14];
  } else if (tutorialStep === "synth") {
    highlightRow = "synth";
    highlightColumns = [4, 12];
  } else if (tutorialStep === "reverb") {
    highlightEffects = true;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-music-accent p-4 font-sans text-white md:p-8">
      {/* Background ambience */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-music-accent via-music-primary/20 to-music-dark/50 opacity-80" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
        <header className="flex items-end justify-between border-b border-music-light/10 pb-4">
          <div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
              <span className="text-music-primary">Music</span> Lab
            </h1>
            <p className="text-lg text-music-light/80">Make a beat that feels confident</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              className="border border-music-primary/30 bg-music-secondary text-white hover:bg-music-dark"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <Sequencer3D
              tracks={tracks}
              currentStep={currentStep}
              onToggleStep={handleToggleStep}
              highlightRow={highlightRow}
              highlightColumns={highlightColumns}
              isInteractive
            />

            <div className="rounded-xl border border-music-light/10 bg-music-dark/20 p-6 backdrop-blur-sm">
              <Visualizer analyser={analyser} />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <Controls isPlaying={isPlaying} onTogglePlay={handleTogglePlay} tempo={tempo} onTempoChange={setTempo} />

              <Effects
                effects={effects}
                reverbMix={reverbMix}
                onToggleEffect={handleToggleEffect}
                onReverbMixChange={setReverbMix}
                isHighlighted={highlightEffects}
              />

              <div className="rounded-xl border border-music-light/20 bg-music-light/10 p-6">
                <h3 className="mb-3 flex items-center gap-2 font-bold text-music-primary">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-music-primary" />
                  Quick Tips
                </h3>
                <ul className="list-disc space-y-2 pl-4 text-sm text-music-light">
                  <li>Start with Kick on 1, 5, 9, 13.</li>
                  <li>Add Snare on 5 and 13 for a classic backbeat.</li>
                  <li>Hi-Hats add speed and texture.</li>
                  <li>Use Effects to change the vibe.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RhythmCoach
        step={tutorialStep}
        tracks={tracks}
        reverbMix={reverbMix}
        onNext={handleTutorialNext}
        onClose={handleTutorialClose}
        onStart={handleTutorialStart}
        onRestart={resetTutorial}
      />
    </div>
  );
}

