import { cn } from '@/lib/utils'

type RaceTimelineProps = {
  steps: string[]
  currentIndex: number
}

export default function RaceTimeline({ steps, currentIndex }: RaceTimelineProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-full border px-3 py-1 transition',
                index === currentIndex
                  ? 'border-rose-300 bg-rose-400/20 text-rose-100'
                  : index < currentIndex
                    ? 'border-white/20 bg-white/10 text-white/70'
                    : 'border-white/10 text-white/40'
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && <span className="text-white/20">→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
