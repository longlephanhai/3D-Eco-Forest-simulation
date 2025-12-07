import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import * as THREE from "three";
import type { DirectionalLight, Mesh, Points } from "three";

interface CelestialProps {
  setSkyColor: (color: string) => void;
  onCycle?: () => void;
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

  const starColors = useMemo(() => {
    const arr = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      const t = Math.random();
      let col;
      if (t < 0.33) col = new THREE.Color(0x9bbcff);
      else if (t < 0.66) col = new THREE.Color(0xfff7d9);
      else col = new THREE.Color(0xffd6a1);
      arr[i * 3] = col.r;
      arr[i * 3 + 1] = col.g;
      arr[i * 3 + 2] = col.b;
    }
    return arr;
  }, []);

  const starsPositions = useMemo(() => {
    const arr = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 800;
      arr[i * 3 + 1] = Math.random() * 400 + 100;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    return arr;
  }, []);

  // 🌌 Milky Way as dense star field
  const milkyPositions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const angle = (Math.random() - 0.5) * 0.5; // ribbon curve
      arr[i * 3] = (Math.random() - 0.5) * 800;
      arr[i * 3 + 1] = Math.sin(angle) * 150 + 200;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    return arr;
  }, []);

  const milkyColors = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const t = Math.random();
      let col;
      if (t < 0.5) col = new THREE.Color(0xffffff);
      else col = new THREE.Color(0xfff7d9);
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
        x: dir === 1 ? -400 : 400,
        y: Math.random() * 80 + 120,
        z: -200,
        vx: dir * (Math.random() * 2 + 3),
      };
    });
  };

  useEffect(() => {
    const id = setInterval(() => triggerShootingStar(), 7000 + Math.random() * 5000);
    return () => clearInterval(id);
  }, []);

  // Cycle callback
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

    // Cycle detection
    const crossedZero = prevAngle.current > 5.5 && angle < 0.3;
    if (crossedZero) handleCycle();
    prevAngle.current = angle;

    // ===== SUN =====
    const sunX = Math.cos(angle) * 200;
    const sunY = Math.sin(angle) * 150;
    if (sunRef.current) {
      sunRef.current.position.set(sunX, sunY, 150);
      sunRef.current.intensity = THREE.MathUtils.clamp((sunY + 150) / 300, 0.2, 1.2);
    }
    if (sunMeshRef.current) sunMeshRef.current.position.set(sunX, sunY, 150);

    // ===== MOON =====
    const moonAngle = (angle + Math.PI) % (Math.PI * 2);
    const moonX = Math.cos(moonAngle) * 200;
    const moonY = Math.sin(moonAngle) * 150;
    if (moonRef.current) {
      moonRef.current.position.set(moonX, moonY, 150);
      moonRef.current.intensity = THREE.MathUtils.clamp((moonY + 150) / 300, 0.1, 0.8);
    }
    if (moonMeshRef.current) moonMeshRef.current.position.set(moonX, moonY, 150);

    // ===== SKY COLOR =====
    const dayColor = new THREE.Color("#87CEEB");
    const nightColor = new THREE.Color("#001A33");
    const skyFactor = 1 - THREE.MathUtils.clamp((sunY + 150) / 300, 0, 1);
    setSkyColor(`#${dayColor.clone().lerp(nightColor, skyFactor).getHexString()}`);

    // Star opacity
    if (starMaterialRef.current) starMaterialRef.current.opacity = skyFactor;

    // Shooting star
    setShootingStar((s) => {
      if (!s.active) return s;
      const newX = s.x + s.vx;
      if (newX > 450 || newX < -450) return { ...s, active: false };
      return { ...s, x: newX };
    });

    // Milky Way slight motion
    if (milkyRef.current) milkyRef.current.rotation.z = Math.sin(t * 0.05) * 0.1;
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

      {/* ⭐ STARFIELD */}
      <points ref={starsRef}>
        <bufferGeometry>
          {/* @ts-ignore */}
          <bufferAttribute attach="attributes-position" array={starsPositions} count={1000} itemSize={3} />
          {/* @ts-ignore */}
          <bufferAttribute attach="attributes-color" array={starColors} count={1000} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={starMaterialRef} size={2} vertexColors transparent opacity={0} />
      </points>

      {/* 🌌 MILKY WAY - dense stars */}
      <points ref={milkyRef}>
        <bufferGeometry>
          {/* @ts-ignore */}
          <bufferAttribute attach="attributes-position" array={milkyPositions} count={3000} itemSize={3} />
          {/* @ts-ignore */}
          <bufferAttribute attach="attributes-color" array={milkyColors} count={3000} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={2} vertexColors transparent opacity={0.45} />
      </points>

      {/* 🌠 SHOOTING STAR */}
      {shootingStar.active && (
        <mesh position={[shootingStar.x, shootingStar.y, shootingStar.z]}>
          <sphereGeometry args={[2, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
    </>
  );
};

export default Celestial;
