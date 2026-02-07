"use client"

import { useRef, useEffect, Fragment } from "react"
import { gameNodes } from "@/lib/game-data"
import { BoardNode } from "./board-node"
import { PlayerAvatar } from "./player-avatar"

interface GameBoardProps {
  currentNode: number
  completedNodes: Set<number>
  onNodeClick: (nodeId: number) => void
}

const OFFSET = 55
const SVG_W = OFFSET * 2 + 70
const SVG_H = 52
const SVG_CX = SVG_W / 2
const LEFT_X = SVG_CX - OFFSET
const RIGHT_X = SVG_CX + OFFSET

function PathConnector({
  startOnLeft,
  completed,
}: {
  startOnLeft: boolean
  completed: boolean
}) {
  const startX = startOnLeft ? LEFT_X : RIGHT_X
  const endX = startOnLeft ? RIGHT_X : LEFT_X
  const midY = SVG_H / 2
  const pathD = `M${startX} 0 C${startX} ${midY}, ${endX} ${midY}, ${endX} ${SVG_H}`

  return (
    <div className="flex justify-center -my-1 relative z-0">
      <svg
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        aria-hidden="true"
        className="overflow-visible"
      >
        <path
          d={pathD}
          stroke={completed ? "rgba(196, 167, 82, 0.12)" : "rgba(100, 116, 139, 0.25)"}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={pathD}
          stroke={completed ? "rgba(196, 167, 82, 0.5)" : "rgba(100, 116, 139, 0.7)"}
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function GameBoard({
  currentNode,
  completedNodes,
  onNodeClick,
}: GameBoardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current
      const element = activeRef.current
      const containerRect = container.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()

      const scrollTop =
        elementRect.top -
        containerRect.top +
        container.scrollTop -
        containerRect.height / 2 +
        elementRect.height / 2

      container.scrollTo({ top: scrollTop, behavior: "smooth" })
    }
  }, [currentNode])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 board-dots"
      role="region"
      aria-label="Game board"
    >
      <div className="max-w-xs mx-auto flex flex-col items-center">
        {/* Start indicator */}
        <div className="mb-1 flex flex-col items-center gap-1">
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-muted-foreground/60">
            Start
          </span>
          <div className="w-px h-3 bg-border/50" />
        </div>

        {gameNodes.map((node, index) => {
          const isLeft = index % 2 === 0
          const isActive = node.id === currentNode
          const isCompleted = completedNodes.has(node.id)
          const isLocked = node.id > currentNode

          const prevCompleted =
            index > 0 && completedNodes.has(gameNodes[index - 1].id)

          return (
            <Fragment key={node.id}>
              {index > 0 && (
                <PathConnector
                  startOnLeft={(index - 1) % 2 === 0}
                  completed={prevCompleted}
                />
              )}

              <div
                ref={isActive ? activeRef : undefined}
                className="relative z-10"
                style={{
                  transform: `translateX(${isLeft ? -OFFSET : OFFSET}px)`,
                }}
              >
                {isActive && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20">
                    <PlayerAvatar />
                  </div>
                )}
                <BoardNode
                  id={node.id}
                  label={node.label}
                  type={node.type}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  isLocked={isLocked}
                  onClick={() => onNodeClick(node.id)}
                />
              </div>
            </Fragment>
          )
        })}

        {/* Finish marker */}
        <div className="mt-1 flex flex-col items-center gap-1">
          <div className="w-px h-3 bg-border/50" />
          <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 1l2 3h3l-2.5 2.5L11.5 10 8 7.5 4.5 10l1-3.5L3 4h3l2-3z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary/50"
              />
            </svg>
          </div>
          <span className="text-[9px] font-display font-bold uppercase tracking-widest text-muted-foreground/60">
            Finish
          </span>
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
