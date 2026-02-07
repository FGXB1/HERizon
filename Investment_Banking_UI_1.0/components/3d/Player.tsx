"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, Mesh } from "three"

interface PlayerProps {
  currentNode: number
  nodePositions: { id: number; position: [number, number, number] }[]
}

export function Player({ currentNode, nodePositions }: PlayerProps) {
  const meshRef = useRef<Mesh>(null)
  const targetPos = useRef(new Vector3(0, 0, 0))
  const { camera } = useThree()

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Calculate target position based on current node
    const currentNodeData = nodePositions.find((n) => n.id === currentNode)
    if (currentNodeData) {
      // Offset slightly to be in front of the building/character
      // If it's on the left (-6), move slightly right (-2)
      // If it's on the right (6), move slightly left (2)
      const xOffset = currentNodeData.position[0] < 0 ? -2 : 2

      targetPos.current.set(xOffset, 0, currentNodeData.position[2])
    }

    // Smoothly move player
    meshRef.current.position.lerp(targetPos.current, delta * 3)

    // Camera follows player with an offset
    const camTarget = new Vector3()
    camTarget.copy(meshRef.current.position)
    camTarget.y += 8 // Camera height
    camTarget.z += 12 // Camera distance behind

    camera.position.lerp(camTarget, delta * 2)
    camera.lookAt(meshRef.current.position)
  })

  return (
    <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
      <capsuleGeometry args={[0.5, 1, 4, 8]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  )
}
