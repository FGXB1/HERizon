"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Historical facts about female producers mapped to instrument categories
const PRODUCER_FACTS = {
    kick: {
        name: "WondaGurl",
        fullName: "Ebony Oshuninde",
        fact: "became one of the youngest female producers to go Platinum, crafting heavy 808s for Jay-Z and Drake at age 16.",
        avatar: "W"
    },
    bass: {
        name: "Sylvia Robinson",
        fullName: "Sylvia Robinson",
        fact: "is known as the 'Mother of Hip-Hop.' She produced 'Rapper's Delight' and founded Sugar Hill Records, essentially launching the genre.",
        avatar: "S"
    },
    synth: {
        name: "Wendy Carlos",
        fullName: "Wendy Carlos",
        fact: "popularized the Moog synthesizer with her album 'Switched-On Bach,' proving electronic music could be emotive and commercially successful.",
        avatar: "W"
    },
    piano: {
        name: "Wendy Carlos",
        fullName: "Wendy Carlos",
        fact: "popularized the Moog synthesizer with her album 'Switched-On Bach,' proving electronic music could be emotive and commercially successful.",
        avatar: "W"
    },
    snare: {
        name: "Susan Rogers",
        fullName: "Susan Rogers",
        fact: "was the engineer behind Prince's 'Purple Rain.' She often crafted the iconic cavernous sound that defined the 80s.",
        avatar: "S"
    },
    hihat: {
        name: "Susan Rogers",
        fullName: "Susan Rogers",
        fact: "was the engineer behind Prince's 'Purple Rain.' She often crafted the iconic cavernous sound that defined the 80s.",
        avatar: "S"
    },
    clap: {
        name: "Susan Rogers",
        fullName: "Susan Rogers",
        fact: "was the engineer behind Prince's 'Purple Rain.' She often crafted the iconic cavernous sound that defined the 80s.",
        avatar: "S"
    }
};

interface ProducerSpotlightProps {
    activeInstrument: string | null;
}

export function ProducerSpotlight({ activeInstrument }: ProducerSpotlightProps) {
    const [shownInstruments, setShownInstruments] = React.useState<Set<string>>(new Set());
    const [visibleInstrument, setVisibleInstrument] = React.useState<string | null>(null);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        // Only show if we have an active instrument and it hasn't been shown before
        if (activeInstrument && !shownInstruments.has(activeInstrument)) {
            // Mark as shown
            setShownInstruments(prev => new Set(prev).add(activeInstrument));

            // Show the insight
            setVisibleInstrument(activeInstrument);

            // Clear any existing timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Set timer to hide after 10 seconds
            timerRef.current = setTimeout(() => {
                setVisibleInstrument(null);
            }, 10000);
        }

        // Cleanup timer on unmount
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [activeInstrument, shownInstruments, visibleInstrument]);

    const producer = visibleInstrument ? PRODUCER_FACTS[visibleInstrument as keyof typeof PRODUCER_FACTS] : null;

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {producer ? (
                    <motion.div
                        key={activeInstrument}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="bg-music-dark/80 backdrop-blur-md border border-music-primary/30 p-4 shadow-lg">
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-music-primary flex items-center justify-center text-white font-bold text-sm border-2 border-pink-400/50">
                                        {producer.avatar}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles className="w-3 h-3 text-pink-400 shrink-0" />
                                        <span className="text-[10px] uppercase tracking-wider text-music-light/60 font-mono">Did you know?</span>
                                    </div>
                                    <p className="text-sm text-music-light leading-relaxed">
                                        <span className="text-pink-400 font-bold">{producer.name}</span>
                                        {producer.fullName !== producer.name && (
                                            <span className="text-music-light/70"> ({producer.fullName})</span>
                                        )}
                                        {' '}{producer.fact}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Card className="bg-music-dark/60 backdrop-blur-md border border-music-light/10 p-4">
                            <div className="flex items-center gap-2 justify-center text-music-light/50">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-xs font-mono">Select an instrument to learn a story about a female producer!</span>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
