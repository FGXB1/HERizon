"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useMemo } from "react"
import { gameNodes } from "@/lib/game-data"
import { World } from "./World"
import { Player } from "./Player"
import { Building } from "./Building"
import { Character } from "./Character"
import { EventMarker } from "./EventMarker"
import { PerspectiveCamera, Loader, Sky } from "@react-three/drei"

interface SceneProps {
  currentNode: number
  completedNodes: Set<number>
  onNodeClick: (nodeId: number) => void
}

export function Scene({ currentNode, completedNodes, onNodeClick }: SceneProps) {
  // Precompute node positions
  const nodePositions = useMemo(() => {
    return gameNodes.map((node, index) => {
      // Start slightly forward so node 1 is visible
      const z = -index * 15
      // Alternate left/right. index 0 is left (-4), index 1 is right (4)
      const x = index % 2 === 0 ? -6 : 6
      return { ...node, position: [x, 0, z] as [number, number, number] }
    })
  }, [])

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={50} />

          <World />

          {/* Skybox */}
          <Sky sunPosition={[10, 10, 10]} turbidity={0.5} rayleigh={0.5} />

          <Player currentNode={currentNode} nodePositions={nodePositions} />

          {nodePositions.map((node) => {
            const isCompleted = completedNodes.has(node.id)
            const isCurrent = node.id === currentNode

            // Common props
            const props = {
              key: node.id,
              node: node,
              isCompleted,
              isCurrent,
              onClick: () => onNodeClick(node.id)
            }

            if (node.type === 'building') {
              return <Building {...props} />
            }
            if (node.type === 'character') {
              return <Character {...props} />
            }
            return <EventMarker {...props} />
          })}
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}
