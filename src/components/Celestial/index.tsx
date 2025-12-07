// Celestial.tsx
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useCallback } from "react";
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

  // ⭐ Starfield Refs
  const starsRef = useRef<Points>(null);
  const starMaterialRef = useRef<THREE.PointsMaterial>(null);

  // ⭐ Generate static star positions (only once)
  const starsPositions = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = Math.random() * 400 + 100; // only above
      positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    return positions;
  }, []);

  const handleCycle = useCallback(() => {
    if (!cycleCooldown.current && onCycle) {
      onCycle();
      cycleCooldown.current = true;

      setTimeout(() => {
        cycleCooldown.current = false;
      }, 2000);
    }
  }, [onCycle]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2;
    const angle = t % (Math.PI * 2);

    const crossedZero = prevAngle.current > 5.5 && angle < 0.3;
    if (crossedZero) handleCycle();
    prevAngle.current = angle;

    // ===== SUN =====
    const sunX = Math.cos(angle) * 200;
    const sunY = Math.sin(angle) * 150;
    const sunZ = 150;

    if (sunRef.current) {
      sunRef.current.position.set(sunX, sunY, sunZ);
      sunRef.current.target.position.set(0, 0, 0);
      sunRef.current.target.updateMatrixWorld();

      const sunIntensity = THREE.MathUtils.clamp((sunY + 150) / 300, 0.2, 1.2);
      sunRef.current.intensity = sunIntensity;

      const sunColor = new THREE.Color().setHSL(0.13, 1, sunIntensity / 1.2);
      sunRef.current.color = sunColor;
    }

    if (sunMeshRef.current) {
      sunMeshRef.current.position.set(sunX, sunY, sunZ);
      (sunMeshRef.current.material as THREE.MeshStandardMaterial).emissive.set("#FFD580");
    }

    // ===== MOON =====
    const moonAngle = (angle + Math.PI) % (Math.PI * 2);
    const moonX = Math.cos(moonAngle) * 200;
    const moonY = Math.sin(moonAngle) * 150;
    const moonZ = 150;

    if (moonRef.current) {
      moonRef.current.position.set(moonX, moonY, moonZ);
      moonRef.current.target.position.set(0, 0, 0);
      moonRef.current.target.updateMatrixWorld();

      const moonIntensity = THREE.MathUtils.clamp((moonY + 150) / 300, 0.1, 0.8);
      moonRef.current.intensity = moonIntensity;
      moonRef.current.color.set("#AFCBFF");
    }

    if (moonMeshRef.current) {
      moonMeshRef.current.position.set(moonX, moonY, moonZ);
      (moonMeshRef.current.material as THREE.MeshStandardMaterial).emissive.set("#AFCBFF");
    }

    // ===== DYNAMIC SKY COLOR =====
    const dayColor = new THREE.Color("#87CEEB");
    const nightColor = new THREE.Color("#001A33");
    const skyFactor = 1 - THREE.MathUtils.clamp((sunY + 150) / 300, 0, 1);
    const skyColor = dayColor.clone().lerp(nightColor, skyFactor);
    setSkyColor(`#${skyColor.getHexString()}`);

    // ===== ⭐ STAR BRIGHTNESS =====
    if (starMaterialRef.current) {
      const starOpacity = THREE.MathUtils.clamp(skyFactor, 0, 1); // 0 = day, 1 = midnight
      starMaterialRef.current.opacity = starOpacity;
    }
  });

  return (
    <>
      {/* ===== Sun ===== */}
      <directionalLight
        ref={sunRef}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-250}
        shadow-camera-right={250}
        shadow-camera-top={250}
        shadow-camera-bottom={-250}
      />
      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshStandardMaterial color="#FFD580" emissive="#FFD580" emissiveIntensity={1} />
      </mesh>

      {/* ===== Moon ===== */}
      <directionalLight
        ref={moonRef}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
      />
      <mesh ref={moonMeshRef}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshStandardMaterial color="#AFCBFF" emissive="#AFCBFF" emissiveIntensity={0.8} />
      </mesh>

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
    </>
  );
};

export default Celestial;
