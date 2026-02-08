'use client'

import React, { Component, useEffect, useMemo, useState } from 'react'
import { Space_Grotesk, Sora } from 'next/font/google'
import CarScene, { Hotspot } from '@/components/f1/CarScene'
import TelemetryPanel from '@/components/f1/TelemetryPanel'
import TrackMap from '@/components/f1/TrackMap'
import RaceTimeline from '@/components/f1/RaceTimeline'
import PitStopPanel from '@/components/f1/PitStopPanel'
import { cn } from '@/lib/utils'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

const steps = ['Start', 'Lap 1', 'Lap 2', 'Pit Stop', 'Lap 3', 'Finish']
const pitIndex = steps.indexOf('Pit Stop')

const baseStats = {
  speed: 72,
  control: 68,
  tireWear: 60,
  engineHealth: 70,
  lapTime: 92.4,
}

type UpgradeOption = {
  id: string
  label: string
  description: string
  deltas: Partial<typeof baseStats>
  lapTimeDelta: number
}

type UpgradeCategory = {
  id: string
  label: string
  options: UpgradeOption[]
}

const upgradeCategories: UpgradeCategory[] = [
  {
    id: 'tires',
    label: 'Tires',
    options: [
      {
        id: 'grip-tires',
        label: 'Grip Tires',
        description: 'More control and reduced wear, ideal for clean lines.',
        deltas: { control: 10, tireWear: 6 },
        lapTimeDelta: -1.2,
      },
      {
        id: 'speed-tires',
        label: 'Speed Tires',
        description: 'Higher top speed, but easier to lose control.',
        deltas: { speed: 10, control: -4, tireWear: -6 },
        lapTimeDelta: -1.4,
      },
      {
        id: 'endurance-tires',
        label: 'Endurance Tires',
        description: 'Balanced grip and stability for long stints.',
        deltas: { control: 6, tireWear: 10 },
        lapTimeDelta: -0.6,
      },
    ],
  },
  {
    id: 'frame',
    label: 'Frame and Aero',
    options: [
      {
        id: 'downforce-kit',
        label: 'Downforce Kit',
        description: 'Sharper cornering, slight drag on straights.',
        deltas: { control: 8, speed: -3 },
        lapTimeDelta: -0.8,
      },
      {
        id: 'lightweight-frame',
        label: 'Lightweight Frame',
        description: 'Boost acceleration and control with lighter mass.',
        deltas: { speed: 6, control: 4 },
        lapTimeDelta: -1.0,
      },
    ],
  },
  {
    id: 'engine',
    label: 'Fuel and Engine',
    options: [
      {
        id: 'reliability-tune',
        label: 'Reliability Tune',
        description: 'Smoother engine temps, keeps performance stable.',
        deltas: { engineHealth: 12, speed: -2 },
        lapTimeDelta: -0.4,
      },
      {
        id: 'boost-mode',
        label: 'Boost Mode',
        description: 'Short burst of speed, risk on engine health.',
        deltas: { speed: 10, engineHealth: -6 },
        lapTimeDelta: -1.6,
      },
      {
        id: 'fuel-efficiency',
        label: 'Fuel Efficiency',
        description: 'Longer run time with steady pace.',
        deltas: { engineHealth: 8, control: 2 },
        lapTimeDelta: -0.5,
      },
    ],
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

class F1ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0b0a12] p-8 text-center">
          <p className="text-rose-200/70">Something went wrong loading the F1 demo</p>
          <p className="max-w-xl text-sm text-white/60">{this.state.error?.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default function F1DemoClient() {
  const [view, setView] = useState<'race' | 'pit' | 'result'>('race')
  const [currentStep, setCurrentStep] = useState(1)
  const [activeCategory, setActiveCategory] = useState('tires')
  const [activeHotspot, setActiveHotspot] = useState<string | undefined>()
  const [selectedUpgrades, setSelectedUpgrades] = useState<Record<string, string | null>>({
    tires: null,
    frame: null,
    engine: null,
  })

  const hotspots = useMemo<Hotspot[]>(
    () => [
      { id: 'tires', label: 'Tires', category: 'tires', position: [1.8, -0.3, 1.6] },
      { id: 'front', label: 'Front', category: 'frame', position: [2.2, 0.2, 0.2] },
      { id: 'engine', label: 'Engine', category: 'engine', position: [-0.4, 0.4, -1.4] },
      { id: 'aero', label: 'Aero', category: 'frame', position: [-1.6, 0.6, -2.2] },
    ],
    []
  )

  useEffect(() => {
    if (view !== 'race') return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) return prev
        const next = prev + 1
        if (next === pitIndex) {
          setView('pit')
          return next
        }
        if (next >= steps.length - 1) {
          setView('result')
          return steps.length - 1
        }
        return next
      })
    }, 4200)

    return () => clearInterval(interval)
  }, [view])

  useEffect(() => {
    if (view !== 'race') return
    if (currentStep === pitIndex) {
      setView('pit')
    }
    if (currentStep >= steps.length - 1) {
      setView('result')
    }
  }, [currentStep, view])

  useEffect(() => {
    if (view !== 'pit') return
    if (activeHotspot) return
    const hotspot = hotspots.find((spot) => spot.category === activeCategory)
    setActiveHotspot(hotspot?.id)
  }, [activeCategory, activeHotspot, hotspots, view])

  const focusPoint = useMemo(() => {
    const hotspot = hotspots.find((spot) => spot.id === activeHotspot)
    return hotspot ? hotspot.position : null
  }, [activeHotspot, hotspots])

  const derivedStats = useMemo(() => {
    let stats = { ...baseStats }
    let lapTime = baseStats.lapTime

    upgradeCategories.forEach((category) => {
      const optionId = selectedUpgrades[category.id]
      if (!optionId) return
      const option = category.options.find((opt) => opt.id === optionId)
      if (!option) return
      Object.entries(option.deltas).forEach(([key, value]) => {
        stats = {
          ...stats,
          [key]: (stats as Record<string, number>)[key] + (value ?? 0),
        }
      })
      lapTime += option.lapTimeDelta
    })

    return {
      speed: clamp(stats.speed, 0, 100),
      control: clamp(stats.control, 0, 100),
      tireWear: clamp(stats.tireWear, 0, 100),
      engineHealth: clamp(stats.engineHealth, 0, 100),
      lapTime: clamp(lapTime, 78, 110),
    }
  }, [selectedUpgrades])

  const hasSelectedUpgrade = Object.values(selectedUpgrades).some(Boolean)
  const progress = currentStep / (steps.length - 1)

  return (
    <F1ErrorBoundary>
    <main
      className={cn(
        'relative min-h-screen overflow-x-hidden bg-[#240115] text-white',
        spaceGrotesk.variable,
        sora.variable
      )}
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#D16666]/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-120px] top-[10%] h-[360px] w-[360px] rounded-full bg-[#2C4251]/45 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-160px] left-[-120px] h-[420px] w-[420px] rounded-full bg-[#550C18]/60 blur-[130px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-24 pt-10">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-[#C1C1C1]/70">F1 Pit Stop Decision Lab</p>
              <h1 className="mt-4 text-4xl font-semibold md:text-5xl" style={{ fontFamily: 'var(--font-space)' }}>
                Curiosity meets performance strategy
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[#C1C1C1]/80" style={{ fontFamily: 'var(--font-sora)' }}>
                Guide the pit stop, tune the car, and see how your decisions shape the race narrative.
              </p>
            </div>
            <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
              Mode: {view === 'race' ? 'Race View' : view === 'pit' ? 'Pit Stop' : 'Results'}
            </div>
          </div>

          <RaceTimeline steps={steps} currentIndex={currentStep} />
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_2.4fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-[#2C4251]/40 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-[#C1C1C1]/70">Mission Control</p>
              <p className="mt-3 text-base text-white">
                Balance speed, control, and reliability, then trust your instincts.
              </p>
              <div className="mt-5 grid gap-2 text-xs text-[#C1C1C1]/70">
                <p>Auto progress pauses at pit stop.</p>
                <p>Pick upgrades, then continue the race.</p>
                <p>Use hotspots to focus the inspection.</p>
              </div>
            </div>
            <TrackMap progress={progress} />
          </div>

          <div className="relative">
            <div className="absolute -top-6 right-6 z-20 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80">
              Lap {currentStep}
            </div>
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-[#2C4251]/30 to-[#240115]/80 p-5 shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#C1C1C122,transparent_55%)]" />
              <div className="relative z-10 flex h-[480px] flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#C1C1C1]/70">Decision Garage</p>
                    <h2 className="mt-2 text-lg font-semibold">RX-7 Strategy Rig</h2>
                  </div>
                  {view === 'race' && currentStep < pitIndex && (
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/70">
                      Auto scouting
                    </span>
                  )}
                  {view === 'pit' && (
                    <span className="rounded-full border border-[#D16666]/40 bg-[#D16666]/20 px-3 py-1 text-xs text-white">
                      360 inspection active
                    </span>
                  )}
                </div>
                <div className="mt-4 flex-1">
                  <CarScene
                    modelUrl="/models/rx7/FINAL_MODEL_RMAGIC.fbx"
                    mode={view === 'pit' ? 'pit' : 'race'}
                    hotspots={view === 'pit' ? hotspots : []}
                    activeHotspot={activeHotspot}
                    focusPoint={focusPoint}
                    onHotspotClick={(hotspot) => {
                      setActiveHotspot(hotspot.id)
                      setActiveCategory(hotspot.category)
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-[#C1C1C1]/70">
                  <span>{view === 'pit' ? 'Tap hotspots to tune upgrades.' : 'Race view has subtle auto rotation.'}</span>
                  <span className="uppercase tracking-[0.3em]">Telemetry synced</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <TelemetryPanel
              stats={{
                speed: derivedStats.speed,
                control: derivedStats.control,
                tireWear: derivedStats.tireWear,
                engineHealth: derivedStats.engineHealth,
              }}
              lapTime={derivedStats.lapTime}
            />
            {view === 'pit' && (
              <PitStopPanel
                categories={upgradeCategories.map((category) => ({
                  id: category.id,
                  label: category.label,
                  options: category.options.map((option) => ({
                    id: option.id,
                    label: option.label,
                    description: option.description,
                  })),
                }))}
                activeCategory={activeCategory}
                selected={selectedUpgrades}
                onSelect={(categoryId, optionId) => {
                  setSelectedUpgrades((prev) => ({ ...prev, [categoryId]: optionId }))
                  setActiveCategory(categoryId)
                  const hotspot = hotspots.find((spot) => spot.category === categoryId)
                  setActiveHotspot(hotspot?.id)
                }}
                onContinue={() => {
                  if (!hasSelectedUpgrade) return
                  setView('race')
                  setCurrentStep((prev) => Math.max(prev, pitIndex + 1))
                }}
                canContinue={hasSelectedUpgrade}
              />
            )}
          </div>
        </section>

        {view === 'result' && (
          <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#D16666]/25 via-[#240115]/70 to-[#550C18]/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#C1C1C1]/70">Race Summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">You finished with confidence</h2>
                <p className="mt-2 max-w-xl text-sm text-[#C1C1C1]/70">
                  Your upgrades shaped a calmer, faster run, and every choice showed a strong feel for the car.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Final Lap Time</p>
                <p className="mt-2 text-4xl font-semibold text-white">{derivedStats.lapTime.toFixed(2)}s</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                { label: 'Speed', value: derivedStats.speed },
                { label: 'Control', value: derivedStats.control },
                { label: 'Tire Wear', value: derivedStats.tireWear },
                { label: 'Engine Health', value: derivedStats.engineHealth },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{Math.round(stat.value)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
    </F1ErrorBoundary>
  )
}
