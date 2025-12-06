import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { DirectionalLight, Mesh } from "three";

interface CelestialProps {
  setSkyColor: (color: string) => void;
}

const Celestial = ({ setSkyColor }: CelestialProps) => {
  const sunRef = useRef<DirectionalLight>(null);
  const sunMeshRef = useRef<Mesh>(null);
  const moonRef = useRef<DirectionalLight>(null);
  const moonMeshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2; // tốc độ mặt trời
    const angle = t % (Math.PI * 2);

    // --- Sun ---
    const sunX = Math.cos(angle) * 200;
    const sunY = Math.sin(angle) * 150;
    const sunZ = 150;

    if (sunRef.current) {
      sunRef.current.position.set(sunX, sunY, sunZ);
      sunRef.current.target.position.set(0, 0, 0);
      sunRef.current.target.updateMatrixWorld();

      // Ánh sáng mặt trời dựa trên độ cao
      const sunIntensity = THREE.MathUtils.clamp((sunY + 150) / 300, 0.2, 1.2);
      sunRef.current.intensity = sunIntensity;

      const sunColor = new THREE.Color().setHSL(0.13, 1, sunIntensity / 1.2);
      sunRef.current.color = sunColor;
    }

    if (sunMeshRef.current) {
      sunMeshRef.current.position.set(sunX, sunY, sunZ);
      (sunMeshRef.current.material as THREE.MeshStandardMaterial).emissive.set("#FFD580");
    }

    // --- Moon (ngược hướng mặt trời) ---
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

    // --- Sky color dựa vào chiều cao mặt trời ---
    const dayColor = new THREE.Color("#87CEEB");
    const nightColor = new THREE.Color("#001A33");
    const skyFactor = 1 - THREE.MathUtils.clamp((sunY + 150) / 300, 0, 1); // 0 -> day, 1 -> night
    const skyColor = dayColor.clone().lerp(nightColor, skyFactor);
    setSkyColor(`#${skyColor.getHexString()}`);
  });

  return (
    <>
      {/* Sun */}
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

      {/* Moon */}
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
    </>
  );
};

export default Celestial;
