"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, PerspectiveCamera, RoundedBox, Text } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

// Strict Palette: C1C1C1, 2C4251, D16666, 550C18, 240115
const trackColors: Record<string, string> = {
  kick: "#D16666",
  snare: "#550C18",
  hihat: "#C1C1C1",
  clap: "#2C4251",
  synth: "#2C4251",
  piano: "#C1C1C1",
  bass: "#240115",
};

const trackEmissive: Record<string, string> = {
  kick: "#FF4444",
  snare: "#FF0033",
  hihat: "#FFFFFF",
  clap: "#4488AA",
  synth: "#66AACC",
  piano: "#FFFFFF",
  bass: "#880044",
};

const trackNames: Record<string, string> = {
  kick: "Kick",
  snare: "Snare",
  hihat: "Hi-Hat",
  clap: "Clap",
  synth: "Synth",
  piano: "Piano",
  bass: "Bass",
};

interface Sequencer3DProps {
  tracks: { [key: string]: boolean[] };
  currentStep: number;
  onToggleStep: (track: string, step: number) => void;
  highlightRow?: string | null;
  highlightColumns?: number[];
  isInteractive?: boolean;
}

const STEP_SPACING_X = 1.2;
const STEP_SPACING_Y = 1.2;

function StepBox({
  position,
  isActive,
  isCurrent,
  color,
  emissiveColor,
  onClick,
  isInteractive,
  isHighlighted,
}: {
  position: [number, number, number];
  isActive: boolean;
  isCurrent: boolean;
  color: string;
  emissiveColor: string;
  onClick: () => void;
  isInteractive: boolean;
  isHighlighted: boolean;
  trackName: string;
  stepIndex: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    const targetScale = isCurrent && isActive ? 1.4 : hovered && isInteractive ? 1.1 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.2);

    if (isHighlighted && !isActive) {
      const pulse = (Math.sin(state.clock.elapsedTime * 10) + 1) / 2;
      const highlightScale = 1 + pulse * 0.2;
      if (!hovered) meshRef.current.scale.setScalar(highlightScale);
    }
  });

  const materialColor = isActive ? color : "#222";
  const materialEmissive = isActive ? emissiveColor : isHighlighted ? "#555555" : "#000";
  const materialEmissiveIntensity = isActive ? (isCurrent ? 4 : 2) : isHighlighted ? 1 : 0;
  const materialOpacity = isActive ? 0.9 : 0.3;

  return (
    <RoundedBox
      ref={meshRef}
      args={[1, 1, 0.2]}
      position={position}
      radius={0.1}
      smoothness={4}
      onClick={(e) => {
        e.stopPropagation();
        if (isInteractive) onClick();
      }}
      onPointerOver={() => isInteractive && setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      {isActive ? (
        <meshBasicMaterial color={materialEmissive} toneMapped={false} />
      ) : (
        <meshStandardMaterial
          color={materialColor}
          emissive={materialEmissive}
          emissiveIntensity={materialEmissiveIntensity}
          transparent
          opacity={materialOpacity}
          roughness={0.2}
          metalness={0.1}
          toneMapped={false}
        />
      )}
    </RoundedBox>
  );
}

function Playhead({ currentStep }: { currentStep: number }) {
  const ref = useRef<THREE.Group>(null);
  const targetX = (currentStep - 7.5) * STEP_SPACING_X;

  useFrame(() => {
    if (ref.current) {
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.2);
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0.5]}>
        <boxGeometry args={[0.1, 9, 0.1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <pointLight color="#ffffff" intensity={2} distance={5} decay={2} />
    </group>
  );
}

function TrackLabel({
  position,
  text,
  isActive,
}: {
  position: [number, number, number];
  text: string;
  isActive: boolean;
}) {
  return (
    <Text position={position} fontSize={0.4} color={isActive ? "#ffffff" : "#888888"} anchorX="right" anchorY="middle">
      {text}
    </Text>
  );
}

function StepLabel({
  position,
  text,
  isActive,
}: {
  position: [number, number, number];
  text: string;
  isActive: boolean;
}) {
  return (
    <Text
      position={position}
      fontSize={0.3}
      color={isActive ? "#ffffff" : "#444444"}
      anchorX="center"
      anchorY="bottom"
    >
      {text}
    </Text>
  );
}

function Scene({
  tracks,
  currentStep,
  onToggleStep,
  highlightRow,
  highlightColumns,
  isInteractive,
}: Sequencer3DProps) {
  const trackKeys = Object.keys(tracks);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 15]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={5} color="#4400ff" distance={30} decay={1} />

      <group position={[0, 0, 0]}>
        <Playhead currentStep={currentStep} />

        {trackKeys.map((trackKey, trackIndex) => {
          const y = (3 - trackIndex) * STEP_SPACING_Y;
          const steps = tracks[trackKey];
          const isRowHighlighted = highlightRow === trackKey;

          return (
            <group key={trackKey}>
              <TrackLabel
                position={[-8.5 * STEP_SPACING_X, y, 0]}
                text={trackNames[trackKey] || trackKey}
                isActive={isRowHighlighted}
              />

              {steps.map((isActive, stepIndex) => {
                const x = (stepIndex - 7.5) * STEP_SPACING_X;
                const isColHighlighted = highlightColumns?.includes(stepIndex) && isRowHighlighted;
                const isCurrent = currentStep === stepIndex;

                return (
                  <React.Fragment key={`${trackKey}-${stepIndex}`}>
                    {trackIndex === 0 && (
                      <StepLabel position={[x, y + 0.8, 0]} text={(stepIndex + 1).toString()} isActive={!!isColHighlighted || isCurrent} />
                    )}

                    <StepBox
                      position={[x, y, 0]}
                      isActive={isActive}
                      isCurrent={isCurrent}
                      color={trackColors[trackKey] || "#ffffff"}
                      emissiveColor={trackEmissive[trackKey] || "#ffffff"}
                      onClick={() => onToggleStep(trackKey, stepIndex)}
                      isInteractive={isInteractive !== false}
                      isHighlighted={!!isColHighlighted}
                      trackName={trackKey}
                      stepIndex={stepIndex}
                    />
                  </React.Fragment>
                );
              })}
            </group>
          );
        })}
      </group>

      <ContactShadows position={[0, -5, 0]} opacity={0.5} scale={40} blur={2} far={4.5} />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.4} mipmapBlur intensity={2.0} radius={0.6} />
      </EffectComposer>
    </>
  );
}

export function Sequencer3D(props: Sequencer3DProps) {
  const { tracks, onToggleStep, isInteractive } = props;

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border border-music-light/10 bg-black/80">
      {/* Hidden accessibility overlay */}
      <div className="sr-only">
        {Object.entries(tracks).map(([trackName, steps]) => (
          <div key={trackName}>
            {steps.map((_, stepIndex) => (
              <button
                // eslint-disable-next-line react/no-array-index-key
                key={stepIndex}
                onClick={() => isInteractive && onToggleStep(trackName, stepIndex)}
                aria-label={`Toggle ${trackName} step ${stepIndex + 1}`}
                disabled={!isInteractive}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-10">
        <div className="font-mono text-[10px] text-music-light/50">3D VIEW ACTIVE</div>
      </div>

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          toneMapping: THREE.ReinhardToneMapping,
          toneMappingExposure: 1.5,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 24]} fov={50} />
        <OrbitControls
          enablePan={false}
          enableZoom
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
        <Scene {...props} />
      </Canvas>
    </div>
  );
}

