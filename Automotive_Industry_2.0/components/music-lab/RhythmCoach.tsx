"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, HelpCircle, Mic, X } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type TutorialStep =
  | "intro"
  | "kick"
  | "snare"
  | "hihat"
  | "bass"
  | "synth"
  | "reverb"
  | "complete";

interface RhythmCoachProps {
  step: TutorialStep | null; // Null means minimized
  tracks: { [key: string]: boolean[] };
  reverbMix: number;
  onNext: (nextStep: TutorialStep) => void;
  onClose: () => void;
  onStart: () => void;
  onRestart?: () => void;
}

const steps: Record<
  TutorialStep,
  { title: string; text: string; action: string | null; target?: string }
> = {
  intro: {
    title: "Welcome to the Lab",
    text: "I’m The Producer. I’ll help you build a beat that feels confident. Ready?",
    action: "Let’s Make a Beat",
  },
  kick: {
    title: "Step 1: The Foundation",
    text: "Start with the Kick. Place it on columns 1, 5, 9, and 13. That’s the backbone.",
    action: null, // Auto-advance on pattern match
    target: "kick",
  },
  snare: {
    title: "Step 2: The Snap",
    text: "Now add the Snare on columns 5 and 13. That’s your clap on the backbeat.",
    action: null,
    target: "snare",
  },
  hihat: {
    title: "Step 3: The Drive",
    text: "Hi-hats give the beat motion. Place them on columns 3, 7, 11, and 15.",
    action: null,
    target: "hihat",
  },
  bass: {
    title: "Step 4: The Grounding",
    text: "Bass is the muscle. Add a simple bass groove on columns 3, 7, 11, and 15 for bounce.",
    action: null,
    target: "bass",
  },
  synth: {
    title: "Step 5: The Harmony",
    text: "Synth stabs fill space and create emotion. Place Synth on columns 5 and 13.",
    action: null,
    target: "synth",
  },
  reverb: {
    title: "Step 6: The Vibe",
    text: "Turn on Reverb, then set the slider to around 40%. Hear how it adds space.",
    action: null,
    target: "reverb",
  },
  complete: {
    title: "You’re a Producer",
    text: "You built a clean groove: drums, bass, and synth layers. That’s real production thinking.",
    action: "Free Play",
  },
};

export function RhythmCoach({
  step,
  tracks,
  reverbMix,
  onNext,
  onClose,
  onStart,
  onRestart,
}: RhythmCoachProps) {
  // Auto-advance validation logic
  useEffect(() => {
    if (!step) return;

    let timeout: NodeJS.Timeout | undefined;

    const checkPattern = () => {
      if (step === "kick") {
        const k = tracks.kick;
        if (k?.[0] && k?.[4] && k?.[8] && k?.[12]) timeout = setTimeout(() => onNext("snare"), 500);
      } else if (step === "snare") {
        const s = tracks.snare;
        if (s?.[4] && s?.[12]) timeout = setTimeout(() => onNext("hihat"), 500);
      } else if (step === "hihat") {
        const h = tracks.hihat;
        if (h?.[2] && h?.[6] && h?.[10] && h?.[14]) timeout = setTimeout(() => onNext("bass"), 500);
      } else if (step === "bass") {
        const b = tracks.bass;
        if (b?.[2] && b?.[6] && b?.[10] && b?.[14]) timeout = setTimeout(() => onNext("synth"), 500);
      } else if (step === "synth") {
        const sy = tracks.synth;
        if (sy?.[4] && sy?.[12]) timeout = setTimeout(() => onNext("reverb"), 500);
      } else if (step === "reverb") {
        if (reverbMix >= 35 && reverbMix <= 45) timeout = setTimeout(() => onNext("complete"), 500);
      }
    };

    checkPattern();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [step, tracks, reverbMix, onNext]);

  // Confetti on complete
  useEffect(() => {
    if (step !== "complete") return;
    const end = Date.now() + 900;
    const colors = ["#D16666", "#550C18", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [step]);

  const isCenter = step === "intro";
  const isMinimized = !step;
  const content = step ? steps[step] : null;

  return (
    <AnimatePresence mode="wait">
      {isMinimized && (
        <motion.div
          key="minimized"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            variant="default"
            size="icon"
            onClick={onRestart || onStart}
            className="h-12 w-12 rounded-full bg-music-primary text-white shadow-lg shadow-music-primary/30 hover:bg-music-secondary"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {!isMinimized && step && (
        <div
          className={`fixed inset-0 z-[100] pointer-events-none flex ${
            isCenter ? "items-center justify-center bg-black/50 backdrop-blur-sm" : ""
          }`}
        >
          {!isCenter && (
            <div className="fixed bottom-6 right-6 z-40 flex w-[350px] pointer-events-none items-end justify-end">
              <motion.div
                layoutId="tutorial-card"
                className="w-full pointer-events-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <TutorialCard
                  step={step}
                  content={content!}
                  isCenter={false}
                  onNext={onNext}
                  onClose={onClose}
                  onStart={onStart}
                />
              </motion.div>
            </div>
          )}

          {isCenter && (
            <motion.div
              layoutId="tutorial-card"
              className="pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <TutorialCard
                step={step}
                content={content!}
                isCenter
                onNext={onNext}
                onClose={onClose}
                onStart={onStart}
              />
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}

function TutorialCard({
  step,
  content,
  isCenter,
  onClose,
  onStart,
}: {
  step: TutorialStep;
  content: { title: string; text: string; action: string | null };
  isCenter: boolean;
  onNext: (s: TutorialStep) => void;
  onClose: () => void;
  onStart: () => void;
}) {
  return (
    <Card
      className={`
        relative overflow-hidden border border-music-primary bg-music-dark/95 text-white backdrop-blur-xl
        shadow-[0_10px_40px_-10px_rgba(209,102,102,0.5)] transition-all duration-500
        ${isCenter ? "max-w-md p-8" : "w-full p-6"}
      `}
    >
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-music-primary/10 blur-3xl" />

      {!isCenter && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-20 p-1 text-music-light/50 transition-colors hover:text-white"
          aria-label="Close tutorial"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <div className="relative shrink-0">
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-music-primary to-music-secondary shadow-lg">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 animate-ping rounded-full bg-music-primary opacity-20" />
          </div>
          <div>
            <h3 className="text-lg font-bold">The Producer</h3>
            <div className="mt-0.5 flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  step === "complete" ? "bg-blue-500" : "bg-green-500"
                } animate-pulse`}
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-music-light">
                Rhythm Coach
              </span>
            </div>
          </div>
        </div>

        <div>
          <motion.h4
            key={step + "-title"}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-2 text-xl font-bold text-music-primary"
          >
            {content.title}
          </motion.h4>
          <motion.p
            key={step + "-text"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm leading-relaxed text-gray-300"
          >
            {content.text}
          </motion.p>
        </div>

        {step === "complete" && (
          <div className="flex h-12 w-full items-center justify-center gap-1 overflow-hidden rounded-lg bg-black/20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="w-1 rounded-full bg-music-primary/50"
                animate={{ height: [10, 30, 10] }}
                transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: Math.random() * 0.5 }}
              />
            ))}
          </div>
        )}

        <div className="pt-2">
          {content.action ? (
            <Button
              onClick={step === "intro" ? onStart : onClose}
              className="group w-full bg-music-primary font-bold text-white shadow-lg shadow-music-primary/20 hover:bg-music-secondary"
            >
              {content.action}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <div className="flex animate-pulse items-center justify-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-2 font-mono text-xs text-music-light">
              <div className="h-2 w-2 rounded-full bg-music-primary" />
              Waiting for interaction...
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

