import { cn } from '@/lib/utils'

type UpgradeOption = {
  id: string
  label: string
  description: string
}

type Category = {
  id: string
  label: string
  options: UpgradeOption[]
}

type PitStopPanelProps = {
  categories: Category[]
  activeCategory: string
  selected: Record<string, string | null>
  onSelect: (categoryId: string, optionId: string) => void
  onContinue: () => void
  canContinue: boolean
}

export default function PitStopPanel({
  categories,
  activeCategory,
  selected,
  onSelect,
  onContinue,
  canContinue,
}: PitStopPanelProps) {
  return (
    <div className="rounded-2xl border border-rose-200/20 bg-gradient-to-br from-rose-500/10 via-black/40 to-black/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-rose-200/70">Pit Stop</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Decision Panel</h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
          Pick upgrades
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={cn(
              'rounded-xl border p-4 transition',
              activeCategory === category.id
                ? 'border-rose-200/60 bg-rose-400/10'
                : 'border-white/10 bg-white/5'
            )}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">{category.label}</h4>
              {selected[category.id] && (
                <span className="rounded-full border border-emerald-200/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-emerald-100">
                  Locked
                </span>
              )}
            </div>
            <div className="mt-3 grid gap-2">
              {category.options.map((option) => {
                const isSelected = selected[category.id] === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelect(category.id, option.id)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-left text-sm transition',
                      isSelected
                        ? 'border-rose-200/70 bg-rose-400/20 text-white'
                        : 'border-white/10 bg-black/30 text-white/70 hover:border-white/30 hover:text-white'
                    )}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-white/60">{option.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className={cn(
          'mt-5 w-full rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] transition',
          canContinue
            ? 'border-rose-200/60 bg-rose-500/30 text-white hover:bg-rose-500/40'
            : 'cursor-not-allowed border-white/10 bg-white/5 text-white/30'
        )}
      >
        Continue Race
      </button>
    </div>
  )
}
