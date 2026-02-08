'use client'

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Html, OrbitControls, Environment } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export type Hotspot = {
  id: string
  label: string
  category: string
  position: [number, number, number]
}

type CarSceneProps = {
  modelUrl: string
  mode: 'race' | 'pit'
  hotspots: Hotspot[]
  activeHotspot?: string
  onHotspotClick?: (hotspot: Hotspot) => void
  focusPoint?: [number, number, number] | null
}

function CarModel({ url, resourcePath }: { url: string; resourcePath: string }) {
  const fbx = useLoader(FBXLoader, url, (loader) => {
    loader.setResourcePath(resourcePath)
  })

  fbx.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  return (
    <primitive
      object={fbx}
      scale={0.008}
      position={[0, -1.4, 0]}
      rotation={[0, Math.PI * 0.5, 0]}
    />
  )
}

function HotspotMarker({
  hotspot,
  isActive,
  onClick,
}: {
  hotspot: Hotspot
  isActive: boolean
  onClick: () => void
}) {
  return (
    <group position={hotspot.position}>
      <Html center>
        <button
          type="button"
          onClick={onClick}
          className={`group rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition ${
            isActive
              ? 'border-rose-300/90 bg-rose-400/20 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.65)]'
              : 'border-white/30 bg-white/10 text-white/80 hover:border-rose-200/70 hover:text-white'
          }`}
        >
          <span className="block h-2 w-2 rounded-full bg-rose-300/80 group-hover:bg-rose-200" />
          <span className="mt-1 block">{hotspot.label}</span>
        </button>
      </Html>
    </group>
  )
}

function CameraRig({
  mode,
  focusPoint,
}: {
  mode: 'race' | 'pit'
  focusPoint?: [number, number, number] | null
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const desiredPosition = useMemo(() => new THREE.Vector3(4.2, 2.2, 5.4), [])

  useEffect(() => {
    if (!focusPoint) {
      desiredTarget.set(0, 0, 0)
      desiredPosition.set(4.2, 2.2, 5.4)
      return
    }
    desiredTarget.set(focusPoint[0], focusPoint[1], focusPoint[2])
    desiredPosition.set(focusPoint[0] + 2.6, focusPoint[1] + 1.6, focusPoint[2] + 2.8)
  }, [focusPoint, desiredPosition, desiredTarget])

  useFrame(({ camera }) => {
    if (!cameraRef.current) cameraRef.current = camera as THREE.PerspectiveCamera
    if (mode !== 'pit') return
    target.lerp(desiredTarget, 0.08)
    camera.position.lerp(desiredPosition, 0.08)
    camera.lookAt(target)
  })

  return null
}

export default function CarScene({
  modelUrl,
  mode,
  hotspots,
  activeHotspot,
  onHotspotClick,
  focusPoint,
}: CarSceneProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [5.2, 2.2, 6.2], fov: 35 }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.7} />
        <directionalLight intensity={1.1} position={[6, 6, 6]} />
        <pointLight intensity={0.5} position={[-6, 4, -6]} />
        <Environment preset="city" />
        <Suspense
          fallback={
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[2.4, 0.6, 4.4]} />
              <meshStandardMaterial color="#f472b6" />
            </mesh>
          }
        >
          <group>
            <CarModel url={modelUrl} resourcePath="/models/rx7/" />
            {hotspots.map((hotspot) => (
              <HotspotMarker
                key={hotspot.id}
                hotspot={hotspot}
                isActive={activeHotspot === hotspot.id}
                onClick={() => onHotspotClick?.(hotspot)}
              />
            ))}
          </group>
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={mode === 'pit'}
          enableRotate={mode === 'pit'}
          autoRotate={mode === 'race'}
          autoRotateSpeed={0.6}
          minDistance={4.5}
          maxDistance={9.5}
        />
        <CameraRig mode={mode} focusPoint={focusPoint ?? null} />
      </Canvas>
    </div>
  )
}
