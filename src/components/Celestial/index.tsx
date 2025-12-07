// CelestialLevel5.tsx
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import * as THREE from "three";
import type { DirectionalLight, Mesh, Points } from "three";

interface CelestialProps {
  setSkyColor: (color: string) => void;
  onCycle?: () => void;
}

interface Planet {
  ref: React.RefObject<Mesh | null>;
  radius: number;
  speed: number;
  y: number;
  color: string;
  ring?: boolean;
}

const Celestial = ({ setSkyColor, onCycle }: CelestialProps) => {
  const sunRef = useRef<DirectionalLight>(null);
  const sunMeshRef = useRef<Mesh>(null);
  const moonRef = useRef<DirectionalLight>(null);
  const moonMeshRef = useRef<Mesh>(null);

  const prevAngle = useRef(0);
  const cycleCooldown = useRef(false);

  // ⭐ Stars
  const starsRef = useRef<Points>(null);
  const starMaterialRef = useRef<THREE.PointsMaterial>(null);
  const starsPositions = useMemo(() => {
    const arr = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 1000;
      arr[i * 3 + 1] = Math.random() * 500 + 50;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    }
    return arr;
  }, []);

  const starsColors = useMemo(() => {
    const arr = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      const t = Math.random();
      let col = t < 0.33 ? new THREE.Color(0x9bbcff) :
        t < 0.66 ? new THREE.Color(0xfff7d9) : new THREE.Color(0xffd6a1);
      arr[i * 3] = col.r;
      arr[i * 3 + 1] = col.g;
      arr[i * 3 + 2] = col.b;
    }
    return arr;
  }, []);

  // Milky Way
  const milkyPositions = useMemo(() => {
    const arr = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      const angle = (Math.random() - 0.5) * 0.5;
      arr[i * 3] = (Math.random() - 0.5) * 1000;
      arr[i * 3 + 1] = Math.sin(angle) * 150 + 250;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    }
    return arr;
  }, []);

  const milkyColors = useMemo(() => {
    const arr = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      const t = Math.random();
      let col = t < 0.5 ? new THREE.Color(0xffffff) : new THREE.Color(0xfff7d9);
      arr[i * 3] = col.r;
      arr[i * 3 + 1] = col.g;
      arr[i * 3 + 2] = col.b;
    }
    return arr;
  }, []);

  const milkyRef = useRef<Points>(null);

  // 🌠 Shooting Star
  const [shootingStar, setShootingStar] = useState({
    active: false,
    x: 0,
    y: 250,
    z: -200,
    vx: 0,
  });

  const triggerShootingStar = () => {
    setShootingStar((s) => {
      if (s.active) return s;
      const dir = Math.random() < 0.5 ? -1 : 1;
      return {
        active: true,
        x: dir === 1 ? -500 : 500,
        y: Math.random() * 80 + 150,
        z: -200,
        vx: dir * (Math.random() * 3 + 2),
      };
    });
  };

  useEffect(() => {
    const id = setInterval(() => triggerShootingStar(), 7000 + Math.random() * 5000);
    return () => clearInterval(id);
  }, []);

  // 🌫 Nebula
  const nebulaRef = useRef<Points>(null);
  const nebulaPositions = useMemo(() => {
    const arr = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 1000;
      arr[i * 3 + 1] = Math.random() * 300 + 50;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    }
    return arr;
  }, []);

  const nebulaColors = useMemo(() => {
    const arr = new Float32Array(700 * 3);
    for (let i = 0; i < 700; i++) {
      const col = new THREE.Color(`hsl(${Math.random() * 360}, 40%, 50%)`);
      arr[i * 3] = col.r;
      arr[i * 3 + 1] = col.g;
      arr[i * 3 + 2] = col.b;
    }
    return arr;
  }, []);

  // 🌍 Planets
  const planet1Ref = useRef<Mesh>(null);
  const planet2Ref = useRef<Mesh>(null);
  const planets: Planet[] = [
    { ref: planet1Ref, radius: 200, speed: 0.01, y: 50, color: "#FFAA33", ring: true },
    { ref: planet2Ref, radius: 300, speed: 0.006, y: 70, color: "#33AADD" },
  ];

  const handleCycle = useCallback(() => {
    if (!cycleCooldown.current && onCycle) {
      onCycle();
      cycleCooldown.current = true;
      setTimeout(() => (cycleCooldown.current = false), 2000);
    }
  }, [onCycle]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    const angle = t % (Math.PI * 2);
    const crossedZero = prevAngle.current > 5.5 && angle < 0.3;
    if (crossedZero) handleCycle();
    prevAngle.current = angle;

    // Sun / Moon
    const sunX = Math.cos(angle) * 200;
    const sunY = Math.sin(angle) * 150;
    if (sunRef.current) {
      sunRef.current.position.set(sunX, sunY, 150);
      sunRef.current.intensity = THREE.MathUtils.clamp((sunY + 150) / 300, 0.2, 1.2);
    }
    if (sunMeshRef.current) sunMeshRef.current.position.set(sunX, sunY, 150);

    const moonAngle = (angle + Math.PI) % (Math.PI * 2);
    const moonX = Math.cos(moonAngle) * 200;
    const moonY = Math.sin(moonAngle) * 150;
    if (moonRef.current) {
      moonRef.current.position.set(moonX, moonY, 150);
      moonRef.current.intensity = THREE.MathUtils.clamp((moonY + 150) / 300, 0.1, 0.8);
    }
    if (moonMeshRef.current) moonMeshRef.current.position.set(moonX, moonY, 150);

    // Sky gradient
    const dayColor = new THREE.Color("#87CEEB");
    const nightColor = new THREE.Color("#001A33");
    const skyFactor = 1 - THREE.MathUtils.clamp((sunY + 150) / 300, 0, 1);
    setSkyColor(`#${dayColor.clone().lerp(nightColor, skyFactor).getHexString()}`);

    // Starfield
    if (starMaterialRef.current) starMaterialRef.current.opacity = skyFactor;

    // Shooting star
    setShootingStar((s) => {
      if (!s.active) return s;
      const newX = s.x + s.vx;
      if (newX > 600 || newX < -600) return { ...s, active: false };
      return { ...s, x: newX };
    });

    // Milky Way rotation
    if (milkyRef.current) milkyRef.current.rotation.z = Math.sin(t * 0.05) * 0.1;

    // Planets orbit
    planets.forEach((p) => {
      if (p.ref.current) {
        const x = Math.cos(t * p.speed * 100) * p.radius;
        const z = Math.sin(t * p.speed * 100) * p.radius;
        p.ref.current.position.set(x, p.y, z);
        p.ref.current.rotation.y += 0.01;
      }
    });
  });

  return (
    <>
      {/* SUN */}
      <directionalLight ref={sunRef} castShadow />
      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshStandardMaterial emissive="#FFD580" emissiveIntensity={1} />
      </mesh>

      {/* MOON */}
      <directionalLight ref={moonRef} castShadow />
      <mesh ref={moonMeshRef}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshStandardMaterial emissive="#AFCBFF" emissiveIntensity={0.8} />
      </mesh>

      {/* STARFIELD */}
      <points ref={starsRef}>
        <bufferGeometry>
          {/* @ts-ignoreq */}
          <bufferAttribute attach="attributes-position" array={starsPositions} count={1500} itemSize={3} />
          {/* @ts-ignoreq */}
          <bufferAttribute attach="attributes-color" array={starsColors} count={1500} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={starMaterialRef} size={2} vertexColors transparent opacity={0} />
      </points>

      {/* MILKY WAY */}
      <points ref={milkyRef}>
        <bufferGeometry>
          {/* @ts-ignoreq */}
          <bufferAttribute attach="attributes-position" array={milkyPositions} count={4000} itemSize={3} />
          {/* @ts-ignoreq */}
          <bufferAttribute attach="attributes-color" array={milkyColors} count={4000} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={2} vertexColors transparent opacity={0.45} />
      </points>

      {/* SHOOTING STAR */}
      {shootingStar.active && (
        <mesh position={[shootingStar.x, shootingStar.y, shootingStar.z]}>
          <sphereGeometry args={[2, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}

      {/* NEBULA */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          {/* @ts-ignoreq */}
          <bufferAttribute attach="attributes-position" array={nebulaPositions} count={700} itemSize={3} />
          {/* @ts-ignoreq */}
          <bufferAttribute attach="attributes-color" array={nebulaColors} count={700} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={5} vertexColors transparent opacity={0.15} />
      </points>

      {/* PLANETS */}
      {planets.map((p, idx) => (
        <mesh key={idx} ref={p.ref}>
          <sphereGeometry args={[15, 32, 32]} />
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.6} metalness={0.3} roughness={0.3} />
          {p.ring && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[18, 28, 64]} />
              <meshBasicMaterial color="#FFD580" side={THREE.DoubleSide} transparent opacity={0.5} />
            </mesh>
          )}
        </mesh>
      ))}
    </>
  );
};

export default Celestial;
