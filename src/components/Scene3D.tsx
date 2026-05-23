"use client";

import { Float, Line, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Scene3DProps = {
  variant?: "hero" | "future" | "timeline";
};

function TimelineSpine() {
  const points = useMemo(() => {
    return Array.from({ length: 38 }, (_, index) => {
        const t = index / 37;
        return new THREE.Vector3((t - 0.5) * 7.8, Math.sin(t * Math.PI * 3) * 0.2, -0.7);
      });
  }, []);

  return <Line points={points} color="#FFD166" transparent opacity={0.72} lineWidth={2} />;
}

function HolographicHospital() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.16 + pointer.x * 0.08;
    group.current.rotation.x = -0.12 + pointer.y * 0.035;
  });

  return (
    <group ref={group} position={[0, -0.28, 0]}>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.18}>
        <mesh position={[0, -0.8, -0.1]}>
          <boxGeometry args={[4.2, 0.12, 2.25]} />
          <meshStandardMaterial color="#2A1300" emissive="#FF8C00" emissiveIntensity={0.22} metalness={0.45} roughness={0.22} />
        </mesh>
        {[-1.35, 0, 1.35].map((x, index) => (
          <mesh key={x} position={[x, -0.28 + index * 0.08, -0.25]}>
            <boxGeometry args={[0.74, 1.05 + index * 0.25, 0.72]} />
            <meshStandardMaterial color="#3A1A00" emissive={index === 1 ? "#FFD166" : "#FFAA33"} emissiveIntensity={0.18} transparent opacity={0.72} />
          </mesh>
        ))}
        <mesh position={[0, 0.72, -0.28]}>
          <boxGeometry args={[3.6, 0.08, 0.5]} />
          <meshStandardMaterial color="#FFF8EE" emissive="#FFAA33" emissiveIntensity={0.4} transparent opacity={0.38} />
        </mesh>
        <TimelineSpine />
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          return (
            <mesh key={index} position={[Math.cos(angle) * 2.5, Math.sin(angle * 2) * 0.22, Math.sin(angle) * 0.92]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color={index % 4 === 0 ? "#FFF3B0" : "#FFD166"} />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

function NeuralCore({ variant }: Scene3DProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = clock.elapsedTime * 0.12;
    mesh.current.rotation.y = clock.elapsedTime * 0.19;
  });

  return (
    <Float speed={variant === "future" ? 1.8 : 1.1} rotationIntensity={0.18} floatIntensity={0.35}>
      <mesh ref={mesh} position={[0, 0.22, -0.6]}>
        <icosahedronGeometry args={[1.45, 5]} />
        <MeshDistortMaterial
          color={variant === "future" ? "#FFD166" : "#FFAA33"}
          emissive={variant === "future" ? "#FFD166" : "#FFAA33"}
          emissiveIntensity={0.44}
          roughness={0.22}
          metalness={0.36}
          transparent
          opacity={0.18}
          distort={0.22}
          speed={1.3}
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D({ variant = "hero" }: Scene3DProps) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.7, 6.1], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
      className="absolute inset-0"
    >
      <ambientLight intensity={0.54} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} color="#FFF8EE" />
      <pointLight position={[-3, 2, 2]} intensity={1.8} color="#FFAA33" />
      <pointLight position={[3, -1, 1]} intensity={1.2} color="#FFD166" />
      <Sparkles count={variant === "timeline" ? 58 : 90} scale={[8, 4, 4]} size={1.5} speed={0.18} color="#FFF8EE" opacity={0.55} />
      <NeuralCore variant={variant} />
      <HolographicHospital />
    </Canvas>
  );
}
