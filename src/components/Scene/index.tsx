import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, FlyControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { Mesh } from "three";
import Terrain from "../Terrain";
import Tree from "../Tree";
import Forest from "../Forest";
// ===================== Rotating Cube =====================
const RotatingCube = () => {
  const cubeRef = useRef<Mesh>(null);

  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={cubeRef} position={[0, 1, 0]} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

// ===================== Scene =====================
const Scene = () => {
  const [cameraMode, setCameraMode] = useState("orbit"); // orbit | fly

  return (
    <>
      {/* ===== Nút đổi chế độ ===== */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <button onClick={() => setCameraMode("orbit")}>Orbit</button>
        <button onClick={() => setCameraMode("fly")}>Fly</button>
      </div>

      {/* ===== Canvas 3D ===== */}
      <Canvas
        shadows
        camera={{ position: [50, 50, 50], fov: 60 }}
        style={{ width: "100vw", height: "100vh", display: "block" }}
      >
        {/* ===== Lights ===== */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 50, 50]} intensity={1} castShadow />

        {/* ===== Scene Objects ===== */}
        <Terrain />
        <RotatingCube />
        <Forest numTrees={100} areaSize={200} />
        <Tree position={[5, 0, -5]} scale={1} />
        <Tree position={[-3, 0, 2]} scale={0.8} />
        <Tree position={[0, 0, 0]} scale={1.2} />

        {/* ===== Camera Controls ===== */}
        {cameraMode === "orbit" && <OrbitControls />}
        {cameraMode === "fly" && (
          <FlyControls
            movementSpeed={5}   // giảm tốc độ để đỡ chóng mặt
            rollSpeed={Math.PI / 24}  // giảm xoay
            dragToLook={true}
          />
        )}
      </Canvas>
    </>
  );
};

export default Scene;
