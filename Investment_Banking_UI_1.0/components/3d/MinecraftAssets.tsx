"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"
import { Html } from "@react-three/drei"

// ==========================================
// BLOCKY CHARACTER (Minecraft-style)
// ==========================================

export function BlockyCharacter({ color = "#3b82f6", isMoving = false }: { color?: string; isMoving?: boolean }) {
  const groupRef = useRef<any>(null)

  // Limbs for animation
  const leftLegRef = useRef<Mesh>(null)
  const rightLegRef = useRef<Mesh>(null)
  const leftArmRef = useRef<Mesh>(null)
  const rightArmRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!isMoving) {
        // Reset rotation if not moving
        if(leftLegRef.current) leftLegRef.current.rotation.x = 0
        if(rightLegRef.current) rightLegRef.current.rotation.x = 0
        if(leftArmRef.current) leftArmRef.current.rotation.x = 0
        if(rightArmRef.current) rightArmRef.current.rotation.x = 0
        return
    }

    const t = state.clock.getElapsedTime() * 10
    const angle = Math.sin(t) * 0.5

    if (leftLegRef.current) leftLegRef.current.rotation.x = angle
    if (rightLegRef.current) rightLegRef.current.rotation.x = -angle
    if (leftArmRef.current) leftArmRef.current.rotation.x = -angle
    if (rightArmRef.current) rightArmRef.current.rotation.x = angle
  })

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#fca5a5" /> {/* Skin tone */}
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.35, 1, 0]} geometry={undefined}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.35, 1, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-0.15, 0.2, 0]}>
         <boxGeometry args={[0.2, 0.6, 0.2]} />
         <meshStandardMaterial color="#1e293b" /> {/* Pants */}
      </mesh>
      <mesh ref={rightLegRef} position={[0.15, 0.2, 0]}>
         <boxGeometry args={[0.2, 0.6, 0.2]} />
         <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  )
}

// ==========================================
// BRANDED BUILDING (NYC Skyscraper style)
// ==========================================

// Brand colors for major banks
const BRAND_COLORS: Record<string, { primary: string; accent: string; windowTint: string }> = {
  "JPMorgan Chase": { primary: "#0a3d6b", accent: "#1a73b5", windowTint: "#4fc3f7" },
  "Goldman Sachs":  { primary: "#00263a", accent: "#0071bc", windowTint: "#81d4fa" },
  "Citigroup":      { primary: "#003b70", accent: "#e31837", windowTint: "#90caf9" },
  "Morgan Stanley": { primary: "#002b5c", accent: "#00b0f0", windowTint: "#b3e5fc" },
}

export function BlockyBuilding({
    height = 5,
    color = "#94a3b8",
    width = 4,
    depth = 4,
    windows = true,
    brandName,
}: {
    height?: number;
    color?: string;
    width?: number;
    depth?: number;
    windows?: boolean;
    brandName?: string;
}) {

  const brand = brandName ? BRAND_COLORS[brandName] : null
  const buildingColor = brand ? brand.primary : color
  const windowColor = brand ? brand.windowTint : "#fbbf24"
  const accentColor = brand ? brand.accent : "#334155"

  const windowCountY = Math.floor(height) - 1

  const windowPositions = useMemo(() => {
    const pos: { position: [number, number, number]; face: string }[] = []
    if (!windows) return []

    for (let y = 1; y <= windowCountY; y++) {
        for(let x = -width/2 + 0.8; x < width/2; x += 1.0) {
             // Front face
             pos.push({ position: [x, y + 0.5, depth/2 + 0.05], face: "front" })
             // Back face
             pos.push({ position: [x, y + 0.5, -depth/2 - 0.05], face: "back" })
        }
        // Side faces
        for(let z = -depth/2 + 0.8; z < depth/2; z += 1.0) {
             pos.push({ position: [width/2 + 0.05, y + 0.5, z], face: "right" })
             pos.push({ position: [-width/2 - 0.05, y + 0.5, z], face: "left" })
        }
    }
    return pos
  }, [height, width, depth, windows, windowCountY])

  return (
    <group>
      {/* Base / Lobby entrance */}
      <mesh position={[0, 0.4, depth/2 + 0.3]} castShadow>
        <boxGeometry args={[width * 0.4, 0.8, 0.6]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Main Structure */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={buildingColor} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Setback / Upper tower (NYC-style stepped) */}
      {height > 6 && (
        <mesh position={[0, height + 1.5, 0]} castShadow>
          <boxGeometry args={[width * 0.7, 3, depth * 0.7]} />
          <meshStandardMaterial color={buildingColor} roughness={0.6} metalness={0.2} />
        </mesh>
      )}

      {/* Antenna/Spire for tall buildings */}
      {height > 6 && (
        <mesh position={[0, height + 3.5, 0]}>
          <cylinderGeometry args={[0.05, 0.15, 1.5, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
      )}

      {/* Windows (all faces) */}
      {windowPositions.map((w, i) => {
        const rotation: [number, number, number] =
          w.face === "right" ? [0, Math.PI/2, 0] :
          w.face === "left" ? [0, -Math.PI/2, 0] :
          w.face === "back" ? [0, Math.PI, 0] :
          [0, 0, 0]
        return (
          <mesh key={i} position={w.position} rotation={rotation}>
            <planeGeometry args={[0.5, 0.5]} />
            <meshStandardMaterial
              color={windowColor}
              emissive={windowColor}
              emissiveIntensity={0.6}
              transparent
              opacity={0.9}
            />
          </mesh>
        )
      })}

      {/* Accent stripe (brand color bar) */}
      <mesh position={[0, height * 0.85, depth/2 + 0.06]}>
        <planeGeometry args={[width - 0.2, 0.3]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
      </mesh>

      {/* Roof trim */}
      <mesh position={[0, height, 0]}>
         <boxGeometry args={[width + 0.3, 0.25, depth + 0.3]} />
         <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Roof mechanical / AC units */}
      <mesh position={[width * 0.2, height + 0.3, -depth * 0.2]}>
         <boxGeometry args={[0.6, 0.4, 0.6]} />
         <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Brand name sign on front face */}
      {brandName && (
        <Html
          position={[0, height * 0.88, depth/2 + 0.15]}
          center
          distanceFactor={12}
          style={{ pointerEvents: "none" }}
        >
          <div style={{
            color: "#ffffff",
            fontSize: "10px",
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "2px",
            textShadow: `0 0 8px ${accentColor}, 0 0 16px ${accentColor}`,
            whiteSpace: "nowrap",
            userSelect: "none",
          }}>
            {brandName}
          </div>
        </Html>
      )}
    </group>
  )
}
