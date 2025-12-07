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

  // ⭐ Starfield
  const starsRef = useRef<Points>(null);
  const starMaterialRef = useRef<THREE.PointsMaterial>(null);
  // ⭐ Star positions
  const starsPositions = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = Math.random() * 400 + 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    return positions;
  }, []);

  //  Shooting star state
  const [shootingStar, setShootingStar] = useState({
    active: false,
    x: 0,
    y: 250,
    z: -200,
    vx: 0,
  });

  //  Correct shooting star trigger
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
    const id = setInterval(() => {
      triggerShootingStar();
    }, 7000 + Math.random() * 5000);

    return () => clearInterval(id);
  }, []);

  // Day-night cycle callback
  const handleCycle = useCallback(() => {
    if (!cycleCooldown.current && onCycle) {
      onCycle();
      cycleCooldown.current = true;
      setTimeout(() => (cycleCooldown.current = false), 2000);
    }
  }, [onCycle]);

  // FRAME LOOP
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    const angle = t % (Math.PI * 2);

    // detect cycle complete
    const crossedZero = prevAngle.current > 5.5 && angle < 0.3;
    if (crossedZero) handleCycle();
    prevAngle.current = angle;

    // =====  SUN =====
    const sunX = Math.cos(angle) * 200;
    const sunY = Math.sin(angle) * 150;

    if (sunRef.current) {
      sunRef.current.position.set(sunX, sunY, 150);
      sunRef.current.intensity = THREE.MathUtils.clamp(
        (sunY + 150) / 300,
        0.2,
        1.2
      );
    }
    if (sunMeshRef.current) sunMeshRef.current.position.set(sunX, sunY, 150);

    // ===== MOON =====
    const moonAngle = (angle + Math.PI) % (Math.PI * 2);
    const moonX = Math.cos(moonAngle) * 200;
    const moonY = Math.sin(moonAngle) * 150;

    if (moonRef.current) {
      moonRef.current.position.set(moonX, moonY, 150);
      moonRef.current.intensity = THREE.MathUtils.clamp(
        (moonY + 150) / 300,
        0.1,
        0.8
      );
    }
    if (moonMeshRef.current) moonMeshRef.current.position.set(moonX, moonY, 150);

    // ===== SKY COLOR =====
    const dayColor = new THREE.Color("#87CEEB");
    const nightColor = new THREE.Color("#001A33");
    const skyFactor = 1 - THREE.MathUtils.clamp((sunY + 150) / 300, 0, 1);

    setSkyColor(
      `#${dayColor.clone().lerp(nightColor, skyFactor).getHexString()}`
    );

    // =====  TWINKLE =====
    if (starMaterialRef.current) {
      const starOpacity = THREE.MathUtils.clamp(skyFactor, 0, 1);
      starMaterialRef.current.opacity = starOpacity;
    }

    // =====  SHOOTING STAR MOVEMENT =====
    setShootingStar((s) => {
      if (!s.active) return s;

      const newX = s.x + s.vx;

      if (newX > 450 || newX < -450) {
        return { ...s, active: false };
      }

      return { ...s, x: newX };
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
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={starsPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={starMaterialRef}
          size={2}
          color="#ffffff"
          transparent
          opacity={0}
        />
      </points>

      {/*  SHOOTING STAR */}
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
