"use client"

import { Building2, User, Zap, Lock, Check, MessageCircle } from "lucide-react"
import type { NodeType } from "@/lib/game-data"

interface BoardNodeProps {
  id: number
  label: string
  type: NodeType
  isActive: boolean
  isCompleted: boolean
  isLocked: boolean
  onClick: () => void
}

function NodeIcon({ type, size = 18 }: { type: NodeType; size?: number }) {
  switch (type) {
    case "character":
      return <User size={size} />
    case "building":
      return <Building2 size={size} />
    case "event":
      return <Zap size={size} />
    case "negotiation":
      return <MessageCircle size={size} />
  }
}

const typeStyles: Record<
  NodeType,
  { active: string; completed: string; icon: string; completedIcon: string }
> = {
  character: {
    active: "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/30",
    completed: "bg-accent/15 border-accent/50 text-accent",
    icon: "text-accent-foreground",
    completedIcon: "text-accent",
  },
  building: {
    active: "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30",
    completed: "bg-primary/15 border-primary/50 text-primary",
    icon: "text-primary-foreground",
    completedIcon: "text-primary",
  },
  event: {
    active: "bg-chart-4 border-chart-4 text-primary-foreground shadow-lg shadow-orange-500/30",
    completed: "bg-orange-500/15 border-orange-500/50 text-orange-500",
    icon: "text-primary-foreground",
    completedIcon: "text-orange-500",
  },
  negotiation: {
    active: "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30",
    completed: "bg-amber-500/15 border-amber-500/50 text-amber-500",
    icon: "text-white",
    completedIcon: "text-amber-500",
  },
}

export function BoardNode({
  label,
  type,
  isActive,
  isCompleted,
  isLocked,
  onClick,
}: BoardNodeProps) {
  const styles = typeStyles[type]

  const circleClasses = isLocked
    ? "bg-secondary border-border/60 opacity-50"
    : isActive
      ? `${styles.active} scale-110`
      : isCompleted
        ? styles.completed
        : "bg-secondary border-border text-muted-foreground"

  const iconClasses = isLocked
    ? "text-muted-foreground"
    : isActive
      ? styles.icon
      : isCompleted
        ? styles.completedIcon
        : "text-muted-foreground"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className="relative flex flex-col items-center gap-1.5 group transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={`${label}${isLocked ? " (locked)" : isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
    >
      {isActive && (
        <span className="absolute inset-0 -m-3 rounded-full bg-primary/15 animate-pulse-glow pointer-events-none" />
      )}

      <span
        className={`relative flex items-center justify-center w-14 h-14 rounded-full border-[2.5px] transition-all duration-300 ${circleClasses}`}
      >
        {isLocked ? (
          <Lock className="w-4 h-4 text-muted-foreground" />
        ) : (
          <span className={iconClasses}>
            <NodeIcon type={type} size={isActive ? 20 : 18} />
          </span>
        )}

        {isCompleted && !isActive && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center ring-2 ring-background">
            <Check className="w-3 h-3 text-accent-foreground" strokeWidth={3} />
          </span>
        )}
      </span>

      <span
        className={`text-[10px] font-display font-semibold leading-tight text-center max-w-[72px] ${
          isActive
            ? "text-foreground"
            : isCompleted
              ? "text-foreground/70"
              : isLocked
                ? "text-muted-foreground/50"
                : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </button>
  )
}
