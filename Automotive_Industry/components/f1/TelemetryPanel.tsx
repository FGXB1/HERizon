import { cn } from '@/lib/utils'

type Stat = {
  label: string
  value: number
  color: string
}

type TelemetryPanelProps = {
  stats: {
    speed: number
    control: number
    tireWear: number
    engineHealth: number
  }
  lapTime: number
}

function StatBar({ label, value, color }: Stat) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
        <span>{label}</span>
        <span className="text-white/80">{Math.round(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className={cn('h-2 rounded-full transition-all duration-700', color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function TelemetryPanel({ stats, lapTime }: TelemetryPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.35em] text-rose-200/70">
          Live Telemetry
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">Race Pulse</h3>
      </div>
      <div className="space-y-4">
        <StatBar label="Speed" value={stats.speed} color="bg-gradient-to-r from-rose-400 to-orange-300" />
        <StatBar label="Control" value={stats.control} color="bg-gradient-to-r from-sky-400 to-cyan-200" />
        <StatBar label="Tire Wear" value={stats.tireWear} color="bg-gradient-to-r from-amber-300 to-lime-200" />
        <StatBar label="Engine Health" value={stats.engineHealth} color="bg-gradient-to-r from-emerald-400 to-teal-200" />
      </div>
      <div className="mt-6 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Lap Time Prediction</p>
        <p className="mt-2 text-3xl font-semibold text-rose-100">{lapTime.toFixed(2)}s</p>
        <p className="mt-1 text-xs text-white/60">Lower is better, balance speed with control.</p>
      </div>
    </div>
  )
}
