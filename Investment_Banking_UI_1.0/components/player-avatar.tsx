"use client"

export function PlayerAvatar() {
  return (
    <div className="relative animate-avatar-bounce" aria-label="Player avatar">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-primary/50">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-primary-foreground"
          aria-hidden="true"
        >
          <circle cx="8" cy="5" r="3" fill="currentColor" />
          <path
            d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-sm shadow-accent/40" />
    </div>
  )
}
