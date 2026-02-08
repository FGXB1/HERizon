import { useMemo } from 'react'

type TrackMapProps = {
  progress: number
}

export default function TrackMap({ progress }: TrackMapProps) {
  const { dotX, dotY } = useMemo(() => {
    const angle = progress * Math.PI * 2 - Math.PI / 2
    const r = 46
    const x = 60 + r * Math.cos(angle)
    const y = 60 + r * Math.sin(angle)
    return { dotX: x, dotY: y }
  }, [progress])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-rose-200/70">Track Map</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Lap Progress</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
          {Math.round(progress * 100)}%
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center">
        <svg width="140" height="140" viewBox="0 0 120 120" className="text-white/50">
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            opacity="0.2"
          />
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="url(#trackGlow)"
            strokeWidth="10"
            strokeDasharray={Math.PI * 2 * 46}
            strokeDashoffset={(1 - progress) * Math.PI * 2 * 46}
            strokeLinecap="round"
          />
          <circle cx={dotX} cy={dotY} r="6" fill="#fda4af" />
          <defs>
            <linearGradient id="trackGlow" x1="0" x2="120" y1="0" y2="120">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a7f3d0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
