"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Float,
  Html,
  Image as DreiImage,
  MeshReflectorMaterial
} from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { CanvasTexture, DoubleSide, LinearFilter, SRGBColorSpace, TextureLoader, type Group, ACESFilmicToneMapping } from "three";
import * as THREE from "three";
import { decades, pioneers, type Pioneer } from "@/data/site";

const ROOM_SPACING = 16;
const CORRIDOR_WIDTH = 13.5;
const FLOOR_Y = -3.15;
const CEILING_Y = 5.15;

type Decade = (typeof decades)[0];
type ArchiveFocus = { index: number; side: -1 | 1 } | null;
type PioneerFocus = { pioneerId: string } | null;
type RoomSummary = {
  heading: string;
  eyebrow: string;
  narrative: string;
  chips: string[];
  majorEvent?: string;
};

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(" ");
  let line = "";
  let lines = 0;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, y);
      y += lineHeight;
      lines += 1;
      line = word;
      if (lines >= maxLines) return;
    } else {
      line = testLine;
    }
  }

  if (line && lines < maxLines) context.fillText(line, x, y);
}

function ArchiveInfoPlane({
  title,
  lead,
  detail
}: {
  title: string;
  lead: string;
  detail: string;
}) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 960;
    canvas.height = 800;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = "#FFF8EC";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(124, 90, 36, 0.35)";
    context.lineWidth = 10;
    context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    context.fillStyle = "#9A5A12";
    context.font = "700 42px Inter, Segoe UI, Arial, sans-serif";
    context.fillText(title.toUpperCase(), 58, 92);

    context.fillStyle = "#1C1917";
    context.font = "700 54px Inter, Segoe UI, Arial, sans-serif";
    drawWrappedText(context, lead, 58, 182, 830, 66, 3);

    context.fillStyle = "#57534E";
    context.font = "400 36px Inter, Segoe UI, Arial, sans-serif";
    drawWrappedText(context, detail, 58, 474, 830, 50, 4);

    const result = new CanvasTexture(canvas);
    result.minFilter = LinearFilter;
    result.magFilter = LinearFilter;
    result.needsUpdate = true;
    return result;
  }, [detail, lead, title]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <mesh position={[0.87, 0.1, 0.08]}>
      <planeGeometry args={[1.38, 1.16]} />
      {texture ? (
        <meshBasicMaterial map={texture} side={DoubleSide} />
      ) : (
        <meshBasicMaterial color="#FFF8EC" side={DoubleSide} />
      )}
    </mesh>
  );
}

function ArchivePhoto({
  src,
  position,
  scale
}: {
  src: string;
  position: [number, number, number];
  scale: [number, number];
}) {
  const texture = useLoader(TextureLoader, src);

  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <group position={position}>
      <mesh position={[0, 0, 0.012]} castShadow>
        <planeGeometry args={scale} />
        <meshBasicMaterial map={texture} side={DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.004]} castShadow receiveShadow>
        <planeGeometry args={[scale[0] + 0.14, scale[1] + 0.14]} />
        <meshStandardMaterial color="#FFF8EC" side={DoubleSide} metalness={0.05} roughness={0.5} />
      </mesh>
      {[
        [0, scale[1] / 2 + 0.09, scale[0] + 0.18, 0.018],
        [0, -(scale[1] / 2 + 0.09), scale[0] + 0.18, 0.018],
        [-(scale[0] / 2 + 0.09), 0, 0.018, scale[1] + 0.18],
        [scale[0] / 2 + 0.09, 0, 0.018, scale[1] + 0.18]
      ].map(([x, y, width, height], index) => (
        <mesh key={index} position={[x, y, 0.03]} castShadow>
          <boxGeometry args={[width, height, 0.018]} />
          <meshStandardMaterial color="#8A6A35" metalness={0.3} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({
  targetPosition,
  lookAtPosition,
  focused,
  traveling,
  onArrived
}: {
  targetPosition: [number, number, number];
  lookAtPosition: [number, number, number];
  focused: boolean;
  traveling: boolean;
  onArrived: () => void; 
}) {
  const { camera, pointer } = useThree();
  const arrived = useRef(false);

  useFrame(({ clock }) => {
    // Subtle cinematic drift - reduced for realism
    const drift = Math.sin(clock.elapsedTime * 0.8) * (traveling ? 0.015 : 0.008);
    const targetX = focused ? targetPosition[0] : targetPosition[0] + pointer.x * 0.18;
    const targetY = targetPosition[1] + (focused ? pointer.y * 0.02 : pointer.y * 0.08) + drift;
    const targetZ = targetPosition[2];
    const diffX = targetX - camera.position.x;
    const diffY = targetY - camera.position.y;
    const diffZ = targetZ - camera.position.z;

    if (Math.abs(diffX) > 0.025 || Math.abs(diffY) > 0.025 || Math.abs(diffZ) > 0.045) {
      camera.position.x += diffX * 0.065;
      camera.position.y += diffY * 0.065;
      camera.position.z += diffZ * 0.065;
      arrived.current = false;
    } else if (!arrived.current) {
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.position.z = targetZ;
      arrived.current = true;
      onArrived();
    }

    // Improved look-at with subtle parallax
    const lookX = focused ? lookAtPosition[0] : lookAtPosition[0] + pointer.x * 0.4;
    const lookY = lookAtPosition[1] + (focused ? pointer.y * 0.02 : pointer.y * 0.1);
    const lookZ = lookAtPosition[2] + (focused ? pointer.x * 0.05 : 0);
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

function CorridorShell({ length, roomCount }: { length: number; roomCount: number }) {
  const ribs = useMemo(() => Array.from({ length: Math.ceil(length / 6) + 1 }, (_, i) => -i * 6 + 4), [length]);
  const rooms = useMemo(() => Array.from({ length: roomCount }, (_, i) => -(i * ROOM_SPACING + 9)), [roomCount]);
  const wallBays = useMemo(() => Array.from({ length: Math.ceil(length / 12) }, (_, i) => -i * 12 + 1), [length]);

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, -length / 2]}>
        <planeGeometry args={[CORRIDOR_WIDTH, length]} />
        <MeshReflectorMaterial
          blur={[80, 40]}
          color="#C7B17A"
          metalness={0.15}
          mirror={0.15}
          mixBlur={0.3}
          mixStrength={0.25}
          resolution={1024}
          roughness={0.4}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CEILING_Y, -length / 2]} receiveShadow>
        <planeGeometry args={[CORRIDOR_WIDTH, length]} />
        <meshStandardMaterial color="#E8D8BE" metalness={0.05} roughness={0.65} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh key={side} receiveShadow castShadow rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]} position={[side * 6.65, 1, -length / 2]}>
          <planeGeometry args={[length, 8.45]} />
          <meshStandardMaterial color="#DCC7A4" metalness={0.04} roughness={0.6} />
        </mesh>
      ))}

      {wallBays.map((z, index) =>
        [-1, 1].map((side) => (
          <group key={`${z}-${side}`} position={[side * 6.52, 1.05, z]} rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <mesh position={[0, 0.65, 0.018]}>
              <planeGeometry args={[3.55, 3.15]} />
              <meshStandardMaterial color="#F6ECDD" emissive="#B9863B" emissiveIntensity={0.04} metalness={0.03} roughness={0.42} />
            </mesh>
            <mesh position={[0, -1.36, 0.032]}>
              <boxGeometry args={[3.2, 0.035, 0.035]} />
              <meshBasicMaterial color={index % 3 === 0 ? "#B9863B" : "#A68A54"} transparent opacity={0.7} />
            </mesh>
            {Array.from({ length: 4 }, (_, itemIndex) => (
              <mesh key={itemIndex} position={[-1.18 + itemIndex * 0.78, 1.62, 0.036]}>
                <boxGeometry args={[0.36, 0.022, 0.025]} />
                <meshBasicMaterial color="#8A6A35" transparent opacity={0.18 + itemIndex * 0.06} />
              </mesh>
            ))}
          </group>
        ))
      )}

      <mesh position={[0, 1, -(length + 4)]}>
        <planeGeometry args={[CORRIDOR_WIDTH, 8.45]} />
        <meshStandardMaterial color="#E2CFAD" metalness={0.02} roughness={0.56} />
      </mesh>

      {ribs.map((z, index) => (
        <group key={z}>
          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh position={[side * 6.45, 1.05, z]}>
                <boxGeometry args={[0.16, 7.9, 0.16]} />
                <meshStandardMaterial color="#BFA66E" emissive="#B9863B" emissiveIntensity={index % 4 === 0 ? 0.12 : 0.02} metalness={0.32} roughness={0.24} />
              </mesh>
              <mesh position={[side * 6.2, FLOOR_Y + 0.18, z]}>
                <boxGeometry args={[0.18, 0.08, 3.2]} />
                <meshStandardMaterial color="#A87932" emissive="#B9863B" emissiveIntensity={0.24} toneMapped={false} />
              </mesh>
            </group>
          ))}

          <mesh position={[0, CEILING_Y - 0.16, z]}>
            <boxGeometry args={[4.8, 0.06, 1.25]} />
            <meshStandardMaterial color="#FFF7E6" emissive={index % 3 === 0 ? "#D59A45" : "#FFF0C9"} emissiveIntensity={0.55} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {[-1.55, 1.55].map((x) => (
        <mesh key={x} position={[x, FLOOR_Y + 0.035, -length / 2]}>
          <boxGeometry args={[0.055, 0.035, length - 6]} />
          <meshStandardMaterial color="#B9863B" emissive="#B9863B" emissiveIntensity={0.28} toneMapped={false} />
        </mesh>
      ))}

      {Array.from({ length: Math.ceil(length / 4) }, (_, i) => (
        <mesh key={i} position={[0, FLOOR_Y + 0.04, -i * 4 + 2]}>
          <boxGeometry args={[1.12, 0.028, 0.075]} />
          <meshStandardMaterial color={i % 5 === 0 ? "#B9863B" : "#FFF6DF"} emissive={i % 5 === 0 ? "#B9863B" : "#FFF6DF"} emissiveIntensity={0.3} toneMapped={false} />
        </mesh>
      ))}

      {rooms.map((z, i) => (
        <group key={z}>
          <mesh position={[0, CEILING_Y - 0.05, z + 0.7]}>
            <boxGeometry args={[8.4, 0.09, 0.18]} />
            <meshStandardMaterial color="#FFF6DF" emissive="#FFF0C9" emissiveIntensity={0.42} toneMapped={false} />
          </mesh>
          <mesh position={[0, FLOOR_Y + 0.055, z + 0.65]}>
            <boxGeometry args={[6.7, 0.04, 0.08]} />
            <meshStandardMaterial
              color={decades[i]?.majorEvent || i === roomCount - 1 ? "#D59A45" : "#A68A54"}
              emissive={decades[i]?.majorEvent || i === roomCount - 1 ? "#D59A45" : "#A68A54"}
              emissiveIntensity={0.34}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function MuseumDisplayCases() {
  return (
    <group>
      {decades.map((decade, index) => {
        const z = -(index * ROOM_SPACING + 9);
        const accent = decade.majorEvent ? "#C78B35" : "#8A6A35";

        return [-1, 1].map((side) => (
          <Float key={`${decade.decade}-${side}`} speed={0.34} rotationIntensity={0.04} floatIntensity={0.08}>
            <group position={[side * 4.7, -1.18, z + side * 2.6]} rotation={[0, side > 0 ? -0.22 : 0.22, 0]}>
              <mesh position={[0, -1.24, 0]}>
                <boxGeometry args={[1.05, 0.72, 0.86]} />
                <meshStandardMaterial color="#D8C4A2" metalness={0.18} roughness={0.32} />
              </mesh>
              <mesh position={[0, -0.62, 0]}>
                <boxGeometry args={[0.82, 0.92, 0.62]} />
                <meshStandardMaterial
                  color="#9FEFFF"
                  emissive={accent}
                  emissiveIntensity={0.04}
                  metalness={0.1}
                  opacity={0.12}
                  roughness={0.06}
                  transparent
                />
              </mesh>
              <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.34, 0.01, 8, 54]} />
                <meshBasicMaterial color={accent} transparent opacity={0.68} />
              </mesh>
              <mesh position={[0, -0.1, 0]}>
                <octahedronGeometry args={[0.16, 0]} />
                <meshStandardMaterial color="#F7E6C6" emissive={accent} emissiveIntensity={0.38} metalness={0.38} roughness={0.2} toneMapped={false} />
              </mesh>
              <mesh position={[0, -1.62, 0.44]}>
                <boxGeometry args={[0.72, 0.035, 0.035]} />
                <meshBasicMaterial color={accent} transparent opacity={0.9} />
              </mesh>
            </group>
          </Float>
        ));
      })}
    </group>
  );
}

function PottedFlower({
  position,
  scale = 1,
  accent = "#C78B35"
}: {
  position: [number, number, number];
  scale?: number;
  accent?: string;
}) {
  const flowers = useMemo(
    () => [
      [-0.2, 0.78, -0.05, "#E9B949"],
      [0.05, 0.96, 0.02, "#F6C7A8"],
      [0.24, 0.74, 0.08, "#F4E3A1"]
    ] as const,
    []
  );

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.34, 0.42, 0.56, 28]} />
        <meshStandardMaterial color="#B68A52" roughness={0.42} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.31, 0.32, 0.1, 28]} />
        <meshStandardMaterial color="#5E6F38" roughness={0.55} />
      </mesh>
      {flowers.map(([x, y, z, color], flowerIndex) => (
        <group key={`${x}-${z}`} position={[x, y, z]} rotation={[0, flowerIndex * 0.8, 0]}>
          <mesh position={[0, -0.28, 0]} rotation={[0, 0, flowerIndex % 2 === 0 ? 0.08 : -0.08]}>
            <cylinderGeometry args={[0.018, 0.026, 0.62, 10]} />
            <meshStandardMaterial color="#49612E" roughness={0.5} />
          </mesh>
          {[0, 1, 2, 3, 4].map((petal) => {
            const angle = (petal / 5) * Math.PI * 2;
            return (
              <mesh key={petal} position={[Math.cos(angle) * 0.085, 0, Math.sin(angle) * 0.085]} scale={[1.35, 0.5, 0.9]}>
                <sphereGeometry args={[0.065, 14, 10]} />
                <meshStandardMaterial color={color} roughness={0.36} />
              </mesh>
            );
          })}
          <mesh>
            <sphereGeometry args={[0.055, 14, 10]} />
            <meshStandardMaterial color={accent} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {[-0.18, 0.18, 0.03].map((x, index) => (
        <mesh key={index} position={[x, 0.72 + index * 0.06, index % 2 === 0 ? 0.1 : -0.08]} rotation={[0.25, 0.4 + index, 0.5]}>
          <sphereGeometry args={[0.1, 14, 8]} />
          <meshStandardMaterial color="#6F7F3A" roughness={0.58} />
        </mesh>
      ))}
    </group>
  );
}

function MuseumPlants({ roomCount }: { roomCount: number }) {
  return (
    <group>
      {Array.from({ length: roomCount }, (_, index) => {
        const z = -(index * ROOM_SPACING + 5.2);
        return (
          <group key={z}>
            <PottedFlower position={[-5.45, FLOOR_Y + 0.02, z]} scale={0.72} accent={index % 2 === 0 ? "#C78B35" : "#B86B4B"} />
            <PottedFlower position={[5.45, FLOOR_Y + 0.02, z - 4.2]} scale={0.68} accent={index % 2 === 0 ? "#B86B4B" : "#C78B35"} />
          </group>
        );
      })}
    </group>
  );
}

function WallProjection({
  decade,
  z,
  side,
  isFocused,
  onSelect
}: {
  decade: Decade;
  z: number;
  side: -1 | 1;
  isFocused: boolean;
  onSelect: () => void;
}) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const archiveImages = side < 0 ? decade.images.slice(0, 2) : decade.images.slice(2, 4);
  const visibleImages = archiveImages.length > 0 ? archiveImages : decade.images.slice(0, 2);
  const archiveTitle = side < 0 ? "Historical Context" : "Technology Notes";
  const archiveLead = side < 0 ? decade.highlights[0] : decade.developments[0];
  const archiveDetail = side < 0 ? decade.highlights[1] ?? decade.narrative : decade.developments[1] ?? decade.narrative;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 1.08 + Math.sin(clock.elapsedTime * 0.9 + z) * 0.045;
  });

  return (
    <group
      ref={groupRef}
      position={[side * 6.18, 1.08, z + (side > 0 ? -3.4 : 3.4)]}
      rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "zoom-in";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <mesh>
        <planeGeometry args={[3.3, 2.05]} />
        <meshStandardMaterial
          color="#F7EFE0"
          emissive={decade.majorEvent ? "#D59A45" : "#B9863B"}
          emissiveIntensity={hovered || isFocused ? 0.14 : 0.08}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh position={[0, 0, 0.018]}>
        <planeGeometry args={[3.0, 1.72]} />
        <meshBasicMaterial color="#4B3721" transparent opacity={0.04} />
      </mesh>
      <mesh position={[0, 0.74, 0.04]}>
        <boxGeometry args={[2.3, 0.035, 0.02]} />
        <meshBasicMaterial color={decade.majorEvent ? "#C78B35" : "#8A6A35"} transparent opacity={0.88} />
      </mesh>

      {visibleImages[0] && (
        <ArchivePhoto src={visibleImages[0].src} position={[-0.92, 0.34, 0.055]} scale={[1.12, 0.72]} />
      )}

      {visibleImages[1] && (
        <ArchivePhoto src={visibleImages[1].src} position={[-0.92, -0.62, 0.06]} scale={[0.72, 0.46]} />
      )}

      <ArchiveInfoPlane title={archiveTitle} lead={archiveLead} detail={archiveDetail} />

      {Array.from({ length: 8 }, (_, index) => (
        <mesh key={index} position={[-1.15 + index * 0.33, -0.72 + Math.sin(index) * 0.12, 0.04]}>
          <boxGeometry args={[0.14, 0.045 + (index % 4) * 0.07, 0.02]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#C78B35" : "#8A6A35"} transparent opacity={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function ArtifactOrbit({ active, decade }: { active: boolean; decade: Decade }) {
  const groupRef = useRef<Group>(null);
  const color = decade.majorEvent ? "#C78B35" : "#8A6A35";

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * (active ? 0.34 : 0.18);
    groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.35) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0.4]}>
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 3.35, 1.1 + Math.sin(i) * 0.18, Math.sin(angle) * 0.7]}>
            <octahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 1.1 : 0.55} metalness={0.65} roughness={0.18} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function DecadeArtifact({ decade, active }: { decade: Decade; active: boolean }) {
  const groupRef = useRef<Group>(null);
  const accent = decade.majorEvent ? "#C78B35" : "#8A6A35";
  const decadeNumber = Number(decade.decade.replace("s", ""));

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.42) * 0.28;
    groupRef.current.position.y = -0.42 + Math.sin(clock.elapsedTime * 0.72) * 0.05;
  });

  const glowMaterial = (
    <meshStandardMaterial
      color="#EAFBFF"
      emissive={accent}
      emissiveIntensity={active ? 1.2 : 0.7}
      metalness={0.5}
      roughness={0.18}
      toneMapped={false}
    />
  );

  return (
    <Float speed={0.42} rotationIntensity={0.1} floatIntensity={0.18}>
      <group ref={groupRef} position={[-2.88, -0.42, 0.34]} scale={active ? 1 : 0.86}>
        {decadeNumber <= 1960 && (
          <group>
            <mesh>
              <boxGeometry args={[0.78, 0.96, 0.34]} />
              <meshStandardMaterial color="#BFD4DF" metalness={0.8} roughness={0.2} />
            </mesh>
            {Array.from({ length: 5 }, (_, i) => (
              <mesh key={i} position={[0.22, 0.32 - i * 0.16, 0.18]}>
                <boxGeometry args={[0.25, 0.03, 0.025]} />
                <meshBasicMaterial color={i % 2 === 0 ? accent : "#F4FBFF"} transparent opacity={0.95} />
              </mesh>
            ))}
            <mesh position={[-0.2, 0.16, 0.19]}>
              <planeGeometry args={[0.24, 0.34]} />
              <meshBasicMaterial color="#06101D" />
            </mesh>
          </group>
        )}

        {decadeNumber >= 1970 && decadeNumber <= 1980 && (
          <group>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.92, 0.66, 0.38]} />
              <meshStandardMaterial color="#A7B8C5" metalness={0.55} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0.1, 0.205]}>
              <planeGeometry args={[0.62, 0.38]} />
              <meshBasicMaterial color={accent} transparent opacity={0.42} />
            </mesh>
            <mesh position={[0, -0.42, 0.08]}>
              <boxGeometry args={[0.72, 0.13, 0.52]} />
              <meshStandardMaterial color="#DCE7EB" metalness={0.4} roughness={0.22} />
            </mesh>
          </group>
        )}

        {decadeNumber >= 1990 && decadeNumber <= 2000 && (
          <group>
            {Array.from({ length: 4 }, (_, i) => (
              <mesh key={i} position={[0.03 * i, 0.22 - i * 0.13, 0.02 * i]} rotation={[0, 0, -0.08 + i * 0.025]}>
                <boxGeometry args={[0.74, 0.045, 0.52]} />
                <meshStandardMaterial color={i === 1 ? "#EAFBFF" : "#AFC8D5"} emissive={i === 1 ? accent : "#000000"} emissiveIntensity={i === 1 ? 0.34 : 0} metalness={0.34} roughness={0.2} />
              </mesh>
            ))}
            <mesh position={[0.38, -0.06, 0.18]}>
              <boxGeometry args={[0.08, 0.52, 0.06]} />
              {glowMaterial}
            </mesh>
          </group>
        )}

        {decadeNumber >= 2010 && (
          <group>
            <mesh>
              <boxGeometry args={[0.46, 0.88, 0.08]} />
              <meshStandardMaterial color="#D8F5FF" metalness={0.72} roughness={0.14} />
            </mesh>
            <mesh position={[0, 0, 0.055]}>
              <planeGeometry args={[0.36, 0.66]} />
              <meshBasicMaterial color={accent} transparent opacity={0.4} />
            </mesh>
            <mesh position={[0.52, 0.05, 0]}>
              <torusGeometry args={[0.23, 0.018, 8, 42]} />
              {glowMaterial}
            </mesh>
          </group>
        )}

        <mesh position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.72, 0.012, 8, 72]} />
          <meshBasicMaterial color={accent} transparent opacity={active ? 0.72 : 0.36} />
        </mesh>
      </group>
    </Float>
  );
}

function HolographicImageRibbon({
  decade,
  active,
  accent
}: {
  decade: Decade;
  active: boolean;
  accent: string;
}) {
  const groupRef = useRef<Group>(null);
  const galleryImages = decade.images.slice(1, 5);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = -1.08 + Math.sin(clock.elapsedTime * 0.62) * 0.035;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.38) * 0.04;
  });

  if (!active || galleryImages.length === 0) return null;

  return (
    <group ref={groupRef} position={[0, -1.08, 0.32]}>
      {galleryImages.map((image, index) => {
        const offset = index - (galleryImages.length - 1) / 2;
        return (
          <Float key={image.src} speed={0.42 + index * 0.04} rotationIntensity={0.08} floatIntensity={0.1}>
            <group position={[offset * 1.58, index % 2 === 0 ? 0.03 : -0.18, 0.1]} rotation={[0, -offset * 0.08, 0]}>
              <DreiImage url={image.src} scale={[0.98, 0.62]} transparent opacity={0.82} />
              <mesh position={[0, 0, 0.025]}>
                <planeGeometry args={[1.12, 0.74]} />
                <meshBasicMaterial color={accent} transparent opacity={0.08} />
              </mesh>
              {[
                [0, 0.39, 1.16, 0.018],
                [0, -0.39, 1.16, 0.018],
                [-0.59, 0, 0.018, 0.76],
                [0.59, 0, 0.018, 0.76]
              ].map(([x, y, width, height], frameIndex) => (
                <mesh key={frameIndex} position={[x, y, 0.04]}>
                  <boxGeometry args={[width, height, 0.016]} />
                  <meshBasicMaterial color={accent} transparent opacity={0.52} />
                </mesh>
              ))}
            </group>
          </Float>
        );
      })}
    </group>
  );
}

function RoomPartition({ z, opacity = 1 }: { z: number; opacity?: number }) {
  // Only render solid partitions for distant rooms, not adjacent ones
  if (opacity < 0.5) return null;
  
  return (
    <>
      {/* Front partition wall - only for distant rooms */}
      <mesh position={[0, 1, z + 7.5]} receiveShadow>
        <boxGeometry args={[CORRIDOR_WIDTH, 8.45, 0.25]} />
        <meshStandardMaterial 
          color="#E8D8BE" 
          transparent 
          opacity={opacity * 0.95} 
          metalness={0.02} 
          roughness={0.54}
        />
      </mesh>
      
      {/* Back partition wall - only for distant rooms */}
      <mesh position={[0, 1, z - 7.5]} receiveShadow>
        <boxGeometry args={[CORRIDOR_WIDTH, 8.45, 0.25]} />
        <meshStandardMaterial 
          color="#E8D8BE" 
          transparent 
          opacity={opacity * 0.95} 
          metalness={0.02} 
          roughness={0.54}
        />
      </mesh>
    </>
  );
}

function ExhibitChamber({
  decade,
  z,
  isActive
}: {
  decade: Decade;
  z: number;
  isActive: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [hotspot, setHotspot] = useState<string | null>(null);
  const image = decade.images[0];
  const accent = decade.majorEvent ? "#C78B35" : "#8A6A35";
  const softAccent = decade.majorEvent ? "#F0D096" : "#C7B17A";

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const activeLift = isActive ? 0.05 : 0;
    groupRef.current.position.y = 0.48 + activeLift + Math.sin(clock.elapsedTime * 0.65 + z) * 0.015;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.28 + z) * (isActive ? 0.012 : 0.005);
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0.48, z]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
        setHotspot(null);
      }}
    >
      {/* Enhanced spotlight for main exhibit */}
      <spotLight 
        position={[0, 4.5, 2]} 
        angle={0.6} 
        penumbra={0.5} 
        intensity={isActive ? 8.5 : 3.2} 
        color="#FFE8C0"
        target-position={[0, 0.5, z]}
      />
      
      {/* Accent rim lights */}
      <pointLight position={[-3, 2.5, 1]} color="#D59A45" intensity={isActive ? 2.8 : 1.2} distance={7} decay={2} />
      <pointLight position={[3, 2.5, 1]} color="#B9863B" intensity={isActive ? 2.8 : 1.2} distance={7} decay={2} />

      {/* Main exhibit frame - enhanced depth and contrast */}
      <mesh position={[0, 0, -0.12]} castShadow receiveShadow>
        <boxGeometry args={[8.15, 4.95, 0.15]} />
        <meshStandardMaterial 
          color="#D8C4A2" 
          emissive="#8A6A35" 
          emissiveIntensity={isActive ? 0.08 : 0.03} 
          metalness={0.15} 
          roughness={0.45}
        />
      </mesh>

      {/* Inner frame with better contrast */}
      <mesh position={[0, 0, -0.02]} castShadow>
        <boxGeometry args={[7.6, 4.48, 0.08]} />
        <meshStandardMaterial 
          color="#FFF8EC" 
          emissive="#C89A54" 
          emissiveIntensity={0.04} 
          metalness={0.06} 
          roughness={0.35}
        />
      </mesh>

      {/* Enhanced border with depth shadows */}
      {[
        [-4.02, 0, 0.06, 0.12, 4.8, 0.12],
        [4.02, 0, 0.06, 0.12, 4.8, 0.12],
        [0, 2.38, 0.06, 8.08, 0.12, 0.12],
        [0, -2.38, 0.06, 8.08, 0.12, 0.12]
      ].map(([px, py, pz, sx, sy, sz], index) => (
        <mesh key={index} position={[px, py, pz]} castShadow>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial 
            color={softAccent} 
            emissive={accent} 
            emissiveIntensity={isActive || hovered ? 0.35 : 0.12} 
            metalness={0.5} 
            roughness={0.25} 
            toneMapped={false} 
          />
        </mesh>
      ))}

      {/* Accent ring with better visibility */}
      <mesh position={[0, 2.72, 0.18]}>
        <torusGeometry args={[1.08, 0.018, 8, 96]} />
        <meshStandardMaterial 
          color={accent} 
          emissive={accent}
          emissiveIntensity={isActive ? 0.6 : 0.25}
          metalness={0.6}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Main image with improved contrast */}
      {image && (
        <group position={[0, 0.66, 0.14]}>
          <DreiImage url={image.src} scale={[4.82, 2.82]} transparent opacity={isActive ? 1 : 0.85} toneMapped={false} />
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[5.08, 3.08]} />
            <meshBasicMaterial color="#000000" transparent opacity={hovered ? 0.05 : 0} />
          </mesh>
        </group>
      )}

      <DecadeArtifact decade={decade} active={isActive || hovered} />
      <HolographicImageRibbon decade={decade} active={isActive} accent={accent} />

      <group position={[3.04, 0.34, 0.22]}>
        {decade.highlights.slice(0, 2).map((highlight, index) => (
          <group key={highlight} position={[0, 0.4 - index * 0.48, 0]}>
            <mesh>
              <boxGeometry args={[1.16, 0.26, 0.025]} />
              <meshBasicMaterial color={index === 0 ? "#F8E3BD" : accent} transparent opacity={isActive ? 0.24 : 0.12} />
            </mesh>
            <mesh position={[-0.48, 0, 0.03]}>
              <boxGeometry args={[0.11, 0.11, 0.025]} />
              <meshBasicMaterial color={accent} transparent opacity={0.76} />
            </mesh>
            <mesh position={[0.14, 0, 0.035]}>
              <boxGeometry args={[0.72, 0.032, 0.025]} />
              <meshBasicMaterial color="#4B3721" transparent opacity={0.22} />
            </mesh>
          </group>
        ))}
      </group>

      {decade.majorEvent && (
        <mesh position={[2.95, 1.82, 0.22]}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial color="#E6BF66" emissive="#B9863B" emissiveIntensity={0.55} toneMapped={false} />
        </mesh>
      )}

      {decade.developments.slice(0, 3).map((item, index) => (
        <mesh
          key={item}
          position={[-3.55 + index * 3.55, -2.05, 0.2]}
          onPointerOver={() => setHotspot(item)}
          onClick={(event) => {
            event.stopPropagation();
            setHotspot(item);
          }}
        >
          <sphereGeometry args={[0.09, 22, 22]} />
          <meshStandardMaterial color={index === 1 ? "#C78B35" : "#8A6A35"} emissive={index === 1 ? "#C78B35" : "#8A6A35"} emissiveIntensity={0.42} toneMapped={false} />
        </mesh>
      ))}

      <ArtifactOrbit active={isActive || hovered} decade={decade} />

      {hotspot && isActive && (
        <Html position={[0, -2.65, 0.4]} center transform distanceFactor={5.6}>
          <div className="w-64 rounded-md border border-amber-900/20 bg-[#FFF8EC]/95 p-3 text-center text-xs text-stone-800 shadow-[0_16px_36px_rgba(80,48,18,0.18)]">
            <p className="font-semibold uppercase tracking-[0.2em] text-amber-800">Exhibit Detail</p>
            <p className="mt-2 text-sm font-semibold text-stone-950">{hotspot}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function PioneerPlacard({ pioneer, position }: { pioneer: Pioneer; position: [number, number, number] }) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 420;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#FFF8EC");
    gradient.addColorStop(1, "#F3DFBC");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = pioneer.accent === "gold" ? "rgba(181, 126, 35, 0.65)" : "rgba(124, 90, 36, 0.35)";
    context.lineWidth = 8;
    context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    context.fillStyle = pioneer.accent === "gold" ? "#9A5A12" : "#7C5A24";
    context.font = "800 40px Inter, Segoe UI, Arial, sans-serif";
    drawWrappedText(context, pioneer.name.toUpperCase(), 44, 74, 632, 48, 2);

    context.fillStyle = "#1C1917";
    context.font = "700 32px Inter, Segoe UI, Arial, sans-serif";
    drawWrappedText(context, pioneer.title, 44, 172, 632, 40, 2);

    context.fillStyle = "#6B5A45";
    context.font = "500 24px Inter, Segoe UI, Arial, sans-serif";
    context.fillText(pioneer.years, 44, 278);

    context.fillStyle = "#57534E";
    context.font = "400 23px Inter, Segoe UI, Arial, sans-serif";
    drawWrappedText(context, pioneer.summary, 44, 330, 632, 30, 2);

    const result = new CanvasTexture(canvas);
    result.minFilter = LinearFilter;
    result.magFilter = LinearFilter;
    result.needsUpdate = true;
    return result;
  }, [pioneer]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <mesh position={position}>
      <planeGeometry args={[1.18, 0.7]} />
      {texture ? (
        <meshBasicMaterial map={texture} side={DoubleSide} toneMapped={false} />
      ) : (
        <meshBasicMaterial color="#FFF8EC" side={DoubleSide} />
      )}
    </mesh>
  );
}

function PioneerPortrait({
  pioneer,
  index,
  active,
  isFocused,
  onSelect
}: {
  pioneer: Pioneer;
  index: number;
  active: boolean;
  isFocused: boolean;
  onSelect: () => void;
}) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const image = pioneer.image;
  const x = -3.08 + index * 1.54;
  const accent = pioneer.accent === "gold" ? "#C78B35" : pioneer.accent === "candle" ? "#B9863B" : "#8A6A35";

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 0.34 + Math.sin(clock.elapsedTime * 0.72 + index) * 0.035;
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.34 + index) * 0.012;
  });

  return (
    <Float speed={0.32 + index * 0.025} rotationIntensity={0.04} floatIntensity={0.07}>
      <group 
        ref={groupRef} 
        position={[x, 0.34, 0.22]}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "zoom-in";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
      >
        <mesh position={[0, 0.48, -0.025]}>
          <boxGeometry args={[1.28, 1.64, 0.05]} />
          <meshStandardMaterial 
            color="#F8EBD6" 
            emissive={accent} 
            emissiveIntensity={hovered || isFocused ? 0.18 : active ? 0.08 : 0.03} 
            metalness={0.08} 
            roughness={0.35} 
          />
        </mesh>
        <mesh position={[0, 0.48, 0.0]}>
          <planeGeometry args={[1.08, 1.42]} />
          <meshBasicMaterial color="#FFF8EC" />
        </mesh>
        {image && (
          <ArchivePhoto src={image.src} position={[0, 0.56, 0.04]} scale={[0.92, 1.18]} />
        )}
        <PioneerPlacard pioneer={pioneer} position={[0, -0.82, 0.055]} />
        <mesh position={[0, 1.33, 0.08]}>
          <boxGeometry args={[0.66, 0.035, 0.03]} />
          <meshBasicMaterial color={accent} transparent opacity={active ? 0.9 : 0.52} />
        </mesh>
        <mesh position={[0, -1.28, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.34, 0.01, 8, 48]} />
          <meshBasicMaterial color={accent} transparent opacity={active ? 0.48 : 0.25} />
        </mesh>
      </group>
    </Float>
  );
}

function PioneerDataPanel({
  title,
  items,
  side,
  active
}: {
  title: string;
  items: string[];
  side: -1 | 1;
  active: boolean;
}) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 820;
    canvas.height = 620;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = "#FFF8EC";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(124, 90, 36, 0.36)";
    context.lineWidth = 8;
    context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    context.fillStyle = "#9A5A12";
    context.font = "800 38px Inter, Segoe UI, Arial, sans-serif";
    context.fillText(title.toUpperCase(), 48, 78);

    items.slice(0, 4).forEach((item, index) => {
      const y = 160 + index * 104;
      context.fillStyle = index % 2 === 0 ? "#C78B35" : "#8A6A35";
      context.beginPath();
      context.arc(62, y - 10, 10, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#292524";
      context.font = "600 30px Inter, Segoe UI, Arial, sans-serif";
      drawWrappedText(context, item, 92, y, 650, 38, 2);
    });

    const result = new CanvasTexture(canvas);
    result.minFilter = LinearFilter;
    result.magFilter = LinearFilter;
    result.needsUpdate = true;
    return result;
  }, [items, title]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <Float speed={0.28} rotationIntensity={0.035} floatIntensity={0.06}>
      <group position={[side * 5.95, 0.86, -0.2]} rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[2.28, 1.74]} />
          {texture ? (
            <meshBasicMaterial map={texture} side={DoubleSide} toneMapped={false} />
          ) : (
            <meshBasicMaterial color="#FFF8EC" side={DoubleSide} />
          )}
        </mesh>
        <mesh position={[0, -1.0, 0.04]}>
          <boxGeometry args={[1.6, 0.032, 0.03]} />
          <meshBasicMaterial color="#B9863B" transparent opacity={active ? 0.72 : 0.42} />
        </mesh>
      </group>
    </Float>
  );
}

function PioneerHallRoom({ 
  z, 
  isActive,
  pioneerFocus,
  onSelectPioneer 
}: { 
  z: number; 
  isActive: boolean;
  pioneerFocus: PioneerFocus;
  onSelectPioneer: (focus: NonNullable<PioneerFocus>) => void;
}) {
  const groupRef = useRef<Group>(null);
  const pioneerNames = pioneers.map((pioneer) => pioneer.name);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 0.5 + (isActive ? 0.05 : 0) + Math.sin(clock.elapsedTime * 0.56 + z) * 0.015;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.22 + z) * (isActive ? 0.01 : 0.004);
  });

  return (
    <group ref={groupRef} position={[0, 0.5, z]}>
      <spotLight 
        position={[0, 5, 2]} 
        angle={0.6} 
        penumbra={0.5} 
        intensity={isActive ? 9.5 : 4.2} 
        color="#FFE8C0"
      />
      <pointLight position={[0, 1.15, 0.6]} color="#D59A45" intensity={isActive ? 2.2 : 1} distance={7} decay={2} />

      <mesh position={[0, 0, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[8.25, 5.05, 0.15]} />
        <meshStandardMaterial color="#D8C4A2" emissive="#8A6A35" emissiveIntensity={isActive ? 0.08 : 0.03} metalness={0.15} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[7.72, 4.58, 0.08]} />
        <meshStandardMaterial color="#FFF8EC" emissive="#C89A54" emissiveIntensity={0.04} metalness={0.06} roughness={0.32} />
      </mesh>

      {[
        [-4.08, 0, 0.08, 0.12, 4.88, 0.12],
        [4.08, 0, 0.08, 0.12, 4.88, 0.12],
        [0, 2.43, 0.08, 8.18, 0.12, 0.12],
        [0, -2.43, 0.08, 8.18, 0.12, 0.12]
      ].map(([px, py, pz, sx, sy, sz], index) => (
        <mesh key={index} position={[px, py, pz]} castShadow>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial 
            color="#F0D096" 
            emissive="#C78B35" 
            emissiveIntensity={isActive ? 0.4 : 0.15} 
            metalness={0.5} 
            roughness={0.25} 
            toneMapped={false} 
          />
        </mesh>
      ))}

      <mesh position={[0, 2.78, 0.18]}>
        <torusGeometry args={[1.2, 0.018, 8, 96]} />
        <meshStandardMaterial 
          color="#C78B35" 
          emissive="#C78B35"
          emissiveIntensity={isActive ? 0.6 : 0.25}
          metalness={0.6}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>



      {pioneers.map((pioneer, index) => (
        <PioneerPortrait 
          key={pioneer.id} 
          pioneer={pioneer} 
          index={index} 
          active={isActive}
          isFocused={pioneerFocus?.pioneerId === pioneer.id}
          onSelect={() => onSelectPioneer({ pioneerId: pioneer.id })}
        />
      ))}

      <PioneerDataPanel
        title="Foundations"
        items={[
          "Statistics and organized health data",
          "Standardized nursing databases",
          "Computer applications in nursing",
          "Clinical documentation systems"
        ]}
        side={-1}
        active={isActive}
      />
      <PioneerDataPanel
        title="Legacy"
        items={[
          "Nursing Minimum Data Set",
          "Clinical Care Classification System",
          "ANA specialty recognition",
          "Smarter patient care systems"
        ]}
        side={1}
        active={isActive}
      />

      <group position={[0, -2.16, 0.2]}>
        {pioneerNames.map((name, index) => (
          <mesh key={name} position={[-3.2 + index * 1.6, 0, 0]}>
            <sphereGeometry args={[0.075, 22, 22]} />
            <meshStandardMaterial color={index === 4 ? "#E6BF66" : "#B9863B"} emissive={index === 4 ? "#C78B35" : "#8A6A35"} emissiveIntensity={isActive ? 0.5 : 0.24} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function MuseumScene({
  currentIndex,
  archiveFocus,
  pioneerFocus,
  traveling,
  onArrived,
  onSelectArchive,
  onSelectPioneer
}: {
  currentIndex: number;
  archiveFocus: ArchiveFocus;
  pioneerFocus: PioneerFocus;
  traveling: boolean;
  onArrived: () => void;
  onSelectArchive: (focus: NonNullable<ArchiveFocus>) => void;
  onSelectPioneer: (focus: NonNullable<PioneerFocus>) => void;
}) {
  const roomCount = decades.length + 1;
  const corridorLength = roomCount * ROOM_SPACING + 32;
  const roomTargetZ = 1.2 - currentIndex * ROOM_SPACING;
  const archiveRoomZ = archiveFocus ? -(archiveFocus.index * ROOM_SPACING + 9) : 0;
  const archiveWallZ = archiveFocus ? archiveRoomZ + (archiveFocus.side > 0 ? -3.4 : 3.4) : 0;
  const pioneerRoomZ = -(decades.length * ROOM_SPACING + 9);
  
  // Calculate pioneer position if focused
  const focusedPioneer = pioneerFocus ? pioneers.find(p => p.id === pioneerFocus.pioneerId) : null;
  const pioneerIndex = focusedPioneer ? pioneers.findIndex(p => p.id === pioneerFocus.pioneerId) : 0;
  const pioneerX = -3.08 + pioneerIndex * 1.54;
  
  const cameraTarget: [number, number, number] = pioneerFocus
    ? [pioneerX * 0.6, 0.65, pioneerRoomZ + 2.8]
    : archiveFocus
    ? [archiveFocus.side * 4.05, 1.18, archiveWallZ]
    : [0, 0.45, roomTargetZ];
  const lookTarget: [number, number, number] = pioneerFocus
    ? [pioneerX, 0.48, pioneerRoomZ + 0.22]
    : archiveFocus
    ? [archiveFocus.side * 6.18, 1.03, archiveWallZ]
    : [0, 0.5, roomTargetZ - 8];
  
  // Calculate which rooms should be visible based on camera position
  const visibleRoomIndices = useMemo(() => {
    const indices = new Set<number>();
    indices.add(currentIndex);
    // Only show adjacent rooms, not all rooms
    if (currentIndex > 0) indices.add(currentIndex - 1);
    if (currentIndex < roomCount - 1) indices.add(currentIndex + 1);
    return indices;
  }, [currentIndex, roomCount]);

  return (
    <>
      <color attach="background" args={["#E8D8BE"]} />

      {/* Improved lighting setup - reduced lights */}
      <ambientLight intensity={0.65} color="#FFF7EA" />
      <directionalLight 
        position={[5, 12, 8]} 
        intensity={2.2} 
        color="#FFFFFF" 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Key museum lighting - reduced */}
      <spotLight 
        position={[0, 8, 5]} 
        angle={0.5} 
        penumbra={0.6} 
        intensity={3.5} 
        color="#FFE8C0"
      />
      
      {/* Accent rim lights for depth - reduced */}
      <pointLight position={[-6, 3, 2]} intensity={1.5} color="#D59A45" distance={12} decay={2} />
      <pointLight position={[6, 3, 2]} intensity={1.5} color="#B9863B" distance={12} decay={2} />

      <CorridorShell length={corridorLength} roomCount={roomCount} />
      <MuseumDisplayCases />
      <MuseumPlants roomCount={roomCount} />

      {/* Room partitions - only for distant rooms */}
      {decades.map((decade, i) => {
        const z = -(i * ROOM_SPACING + 9);
        const distance = Math.abs(i - currentIndex);
        
        // Only render partitions for rooms that are 2+ away
        if (distance < 2) return null;
        
        return (
          <group key={`partition-${decade.decade}`}>
            <RoomPartition z={z} opacity={1} />
          </group>
        );
      })}
      
      {/* Pioneer room partition - only if far away */}
      {Math.abs(decades.length - currentIndex) >= 2 && (
        <RoomPartition 
          z={-(decades.length * ROOM_SPACING + 9)} 
          opacity={1}
        />
      )}

      {/* Render only visible rooms for performance and visual clarity */}
      {decades.map((decade, i) => {
        const z = -(i * ROOM_SPACING + 9);
        const isVisible = visibleRoomIndices.has(i);
        
        if (!isVisible && !archiveFocus) return null;
        
        return (
          <group key={decade.decade}>
            <WallProjection
              decade={decade}
              z={z}
              side={-1}
              isFocused={archiveFocus?.index === i && archiveFocus.side === -1}
              onSelect={() => onSelectArchive({ index: i, side: -1 })}
            />
            <WallProjection
              decade={decade}
              z={z}
              side={1}
              isFocused={archiveFocus?.index === i && archiveFocus.side === 1}
              onSelect={() => onSelectArchive({ index: i, side: 1 })}
            />
            <ExhibitChamber decade={decade} z={z} isActive={i === currentIndex} />
          </group>
        );
      })}

      {visibleRoomIndices.has(decades.length) && (
        <PioneerHallRoom 
          z={-(decades.length * ROOM_SPACING + 9)} 
          isActive={currentIndex === decades.length}
          pioneerFocus={pioneerFocus}
          onSelectPioneer={onSelectPioneer}
        />
      )}

      <CameraRig
        targetPosition={cameraTarget}
        lookAtPosition={lookTarget}
        focused={Boolean(archiveFocus || pioneerFocus)}
        traveling={traveling}
        onArrived={onArrived}
      />
    </>
  );
}

function HUD({
  room,
  index,
  total,
  archiveFocus,
  pioneerFocus,
  traveling,
  onBackToRoom,
  onNext,
  onPrev,
  onExit
}: {
  room: RoomSummary;
  index: number;
  total: number;
  archiveFocus: ArchiveFocus;
  pioneerFocus: PioneerFocus;
  traveling: boolean;
  onBackToRoom: () => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}) {
  const isLast = index === total - 1;
  const viewingArchive = Boolean(archiveFocus);
  const viewingPioneer = Boolean(pioneerFocus);
  const focusedPioneer = pioneerFocus ? pioneers.find(p => p.id === pioneerFocus.pioneerId) : null;
  const isPioneerRoom = index === total - 1;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <AnimatePresence>
          <motion.div
            key={`${room.heading}-${index}`}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto max-w-xl rounded-md border border-amber-900/20 bg-[#FFF8EC] px-5 py-4 text-stone-950 shadow-[0_18px_48px_rgba(80,48,18,0.22)]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-800">
              Nursing Informatics Museum Gallery
            </p>
            <p className="mt-2 text-xl font-semibold text-stone-950 sm:text-2xl">
              {room.heading}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-stone-500">
              {viewingPioneer ? `Pioneer: ${focusedPioneer?.name}` : viewingArchive ? "Archive close-up view" : `${room.eyebrow} ${index + 1} of ${total}`}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-auto flex items-center gap-2">
          {(viewingArchive || viewingPioneer) && (
            <button
              type="button"
              onClick={onBackToRoom}
              className="rounded-full border border-amber-900/20 bg-[#FFF8EC] px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-900 shadow-lg transition hover:border-amber-700 hover:bg-amber-100"
            >
              Back to Room
            </button>
          )}
          <button
            type="button"
            onClick={onExit}
            className="rounded-full border border-amber-900/20 bg-[#FFF8EC]/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-900 shadow-lg transition hover:border-amber-700 hover:text-amber-800"
          >
            Exit
          </button>
        </div>
      </div>

      {!viewingArchive && !viewingPioneer && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <AnimatePresence>
              <motion.div
                key={`${room.heading}-narrative-${index}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.15 }}
                className="max-w-lg rounded-md border border-amber-900/20 bg-[#FFF8EC] p-5 text-stone-950 shadow-[0_18px_48px_rgba(80,48,18,0.22)]"
              >
                <p className="text-sm leading-6 text-stone-700">{room.narrative}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {room.chips.slice(0, 3).map((item) => (
                    <span key={item} className="rounded-full border border-amber-900/15 bg-amber-100/55 px-3 py-1 text-[11px] text-stone-700">
                      {item}
                    </span>
                  ))}
                </div>
                {room.majorEvent && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-700/35 bg-amber-100/70 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                      {room.majorEvent}
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-auto flex items-center gap-3">
              {index > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="rounded-full border border-amber-900/20 bg-[#FFF8EC] px-5 py-3 text-sm font-bold text-stone-800 shadow-lg transition hover:border-amber-700 hover:bg-amber-100"
            >
              Prev
            </button>
              )}
              <button
                type="button"
                onClick={onNext}
                className="rounded-full bg-stone-950 px-7 py-3 text-sm font-bold text-[#FFF8EC] shadow-[0_18px_42px_rgba(80,48,18,0.22)] transition hover:scale-105 hover:bg-amber-800"
              >
                {isLast ? "Finish Tour" : "Next Room"}
              </button>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === index ? 28 : 7,
                  background: i === index ? "#7C5A24" : "rgba(80,48,18,0.24)"
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function GalleryExperience({ onExit }: { onExit: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [archiveFocus, setArchiveFocus] = useState<ArchiveFocus>(null);
  const [pioneerFocus, setPioneerFocus] = useState<PioneerFocus>(null);
  const [traveling, setTraveling] = useState(false);
  const [finished, setFinished] = useState(false);
  const totalRooms = decades.length + 1;
  const activeDecade = decades[Math.min(currentIndex, decades.length - 1)];
  const activeRoom: RoomSummary =
    currentIndex === decades.length
      ? {
          heading: "Hall of Pioneers",
          eyebrow: "Pioneer Wing",
          narrative:
            "A dedicated museum room honoring Florence Nightingale, Harriet H. Werley, Kathleen A. McCormick, Rita D. Zielstorff, and Virginia K. Saba for shaping data-driven nursing care.",
          chips: pioneers.map((pioneer) => pioneer.name),
          majorEvent: "Pioneer Gallery"
        }
      : {
          heading: `${activeDecade.decade} / ${activeDecade.title}`,
          eyebrow: "Timeline Room",
          narrative: activeDecade.narrative,
          chips: activeDecade.developments,
          majorEvent: activeDecade.majorEvent
        };

  const handleArrived = useCallback(() => {
    setTraveling(false);
  }, []);

  const focusArchive = useCallback((focus: NonNullable<ArchiveFocus>) => {
    document.body.style.cursor = "";
    setArchiveFocus(focus);
    setPioneerFocus(null);
    setCurrentIndex(focus.index);
    setTraveling(true);
  }, []);

  const focusPioneer = useCallback((focus: NonNullable<PioneerFocus>) => {
    document.body.style.cursor = "";
    setPioneerFocus(focus);
    setArchiveFocus(null);
    setCurrentIndex(decades.length);
    setTraveling(true);
  }, []);

  const backToRoom = useCallback(() => {
    if (!archiveFocus && !pioneerFocus) return;
    setArchiveFocus(null);
    setPioneerFocus(null);
    setTraveling(true);
  }, [archiveFocus, pioneerFocus]);

  const goNext = useCallback(() => {
    if (archiveFocus || pioneerFocus) {
      setArchiveFocus(null);
      setPioneerFocus(null);
      setTraveling(true);
      return;
    }
    if (currentIndex >= totalRooms - 1) {
      setFinished(true);
      return;
    }
    setTraveling(true);
    setCurrentIndex((i) => i + 1);
  }, [archiveFocus, pioneerFocus, currentIndex, totalRooms]);

  const goPrev = useCallback(() => {
    if (currentIndex === 0) return;
    setArchiveFocus(null);
    setPioneerFocus(null);
    setTraveling(true);
    setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") goNext();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "Escape") {
        if (archiveFocus || pioneerFocus) {
          backToRoom();
        } else {
          onExit();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [archiveFocus, pioneerFocus, backToRoom, goNext, goPrev, onExit]);

  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#E8D8BE]">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.45, 1.2], fov: 55 }}
        gl={{ 
          antialias: false, 
          alpha: false, 
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
        shadows="basic"
        className="absolute inset-0"
        performance={{ min: 0.5 }}
      >
        <MuseumScene
          currentIndex={currentIndex}
          archiveFocus={archiveFocus}
          pioneerFocus={pioneerFocus}
          traveling={traveling}
          onArrived={handleArrived}
          onSelectArchive={focusArchive}
          onSelectPioneer={focusPioneer}
        />
      </Canvas>

      {!finished && (
        <HUD
          room={activeRoom}
          index={currentIndex}
          total={totalRooms}
          archiveFocus={archiveFocus}
          pioneerFocus={pioneerFocus}
          traveling={traveling}
          onBackToRoom={backToRoom}
          onNext={goNext}
          onPrev={goPrev}
          onExit={onExit}
        />
      )}

      {/* Minimal vignette overlay */}
      <div className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(circle_at_50%_45%,transparent_0%,transparent_80%,rgba(80,48,18,0.04)_100%)]" />



      <AnimatePresence>
        {finished && (
          <motion.div
            className="absolute inset-0 z-30 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* Warm Museum Background */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #FFF8EE 0%, #FFF0D6 50%, #FFE4B5 100%)" }} />
            
            {/* Warm ceiling spotlight */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] opacity-60"
              style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,209,102,0.45) 0%, rgba(255,140,0,0.18) 42%, transparent 72%)" }}
            />

            {/* Subtle warm vignette */}
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(255,220,160,0.18) 0%, transparent 20%, transparent 80%, rgba(255,220,160,0.18) 100%)" }} />

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-orange-400/60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Museum Frame Accents */}
            <div className="absolute left-8 top-1/4 h-32 w-48 opacity-20">
              <motion.div
                className="h-full w-full rounded-lg border border-orange-400/30 bg-gradient-to-br from-orange-400/10 to-amber-500/5"
                animate={{ opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
            <div className="absolute right-12 top-1/3 h-40 w-56 opacity-20">
              <motion.div
                className="h-full w-full rounded-lg border border-amber-400/30 bg-gradient-to-br from-amber-400/10 to-orange-500/5"
                animate={{ opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />
            </div>

            {/* Decorative Lines */}
            <motion.div
              className="absolute left-0 top-1/2 h-px w-1/3 bg-gradient-to-r from-transparent via-orange-400/40 to-transparent"
              animate={{ x: [-200, 400], opacity: [0, 1, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute right-0 top-2/3 h-px w-1/4 bg-gradient-to-l from-transparent via-amber-400/30 to-transparent"
              animate={{ x: [200, -300], opacity: [0, 1, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2 }}
            />

            {/* Floor Reflection */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-950/10 to-transparent">
              <motion.div
                className="absolute bottom-0 left-1/2 h-1 w-64 -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-400/60 to-transparent blur-sm"
                animate={{ scaleX: [0.8, 1.2, 0.8], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            {/* Main Content Container */}
            <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="relative max-w-4xl"
              >
                {/* Eyebrow Label */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-100/40 px-5 py-2 backdrop-blur-xl"
                >
                  <motion.div
                    className="h-2 w-2 rounded-full bg-orange-500"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">Futuristic Medical Digital Museum</span>
                </motion.div>

                {/* Main Quote with Museum Typography */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1.2 }}
                  className="relative mb-8 text-5xl font-semibold leading-tight tracking-tight text-stone-800 sm:text-7xl"
                >
                  History becomes the operating system of future care.
                  
                  {/* Subtle Glow Effect */}
                  <motion.div
                    className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 blur-3xl"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </motion.h2>

                {/* Supporting Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="mx-auto max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl"
                >
                  From 1950s mainframes to mobile health, cloud records, and AI, nursing informatics continues to turn care into safer, smarter systems.
                </motion.p>

                {/* Holographic Healthcare Symbols */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="mt-12 flex justify-center gap-8 opacity-40"
                >
                  {['⚕️', '🏥', '💉', '🔬', '💊'].map((symbol, i) => (
                    <motion.div
                      key={i}
                      className="text-3xl"
                      animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {symbol}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Premium Glassmorphism Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="mt-16 flex flex-wrap justify-center gap-5"
                >
                  {/* Restart Button */}
                  <motion.button
                    type="button"
                    onClick={() => {
                      setCurrentIndex(0);
                      setArchiveFocus(null);
                      setPioneerFocus(null);
                      setFinished(false);
                      setTraveling(false);
                    }}
                    className="group relative overflow-hidden rounded-full border border-orange-200 bg-white/80 px-8 py-4 text-sm font-bold uppercase tracking-wider text-stone-800 backdrop-blur-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-400/20 to-orange-500/0"
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative z-10">Restart Tour</span>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-orange-400/0 transition-all duration-300 group-hover:bg-orange-400/10"
                    />
                  </motion.button>

                  {/* Return Button - Primary */}
                  <motion.button
                    type="button"
                    onClick={() => {
                      setCurrentIndex(decades.length);
                      setArchiveFocus(null);
                      setPioneerFocus(null);
                      setFinished(false);
                      setTraveling(false);
                    }}
                    className="group relative overflow-hidden rounded-full bg-orange-500 px-10 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_28px_rgba(234,88,12,0.40)] transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative z-10">Return to Museum</span>
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.3)] transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </motion.button>

                  {/* Back to Dashboard Button */}
                  <motion.button
                    type="button"
                    onClick={onExit}
                    className="group relative overflow-hidden rounded-full border border-orange-200 bg-white/80 px-8 py-4 text-sm font-bold uppercase tracking-wider text-stone-800 backdrop-blur-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-400/20 to-orange-500/0"
                      animate={{ x: [-200, 200] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative z-10">Back to Dashboard</span>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-orange-400/0 transition-all duration-300 group-hover:bg-orange-400/10"
                    />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom Timeline Glow */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Corner Accent Lights */}
            <motion.div
              className="absolute left-0 top-0 h-32 w-32 bg-gradient-to-br from-orange-500/20 to-transparent blur-3xl"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-32 w-32 bg-gradient-to-tl from-amber-500/20 to-transparent blur-3xl"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
