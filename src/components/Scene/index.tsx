import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, FlyControls } from "@react-three/drei";
import { useRef, useState } from "react";
import Terrain from "../Terrain";
import Tree from "../Tree";
import Forest from "../Forest";
import type { Mesh } from "three";

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

const Scene = () => {
  // Phase 5 + Phase 7 states
  const [cameraMode, setCameraMode] = useState<"orbit" | "fly">("orbit");
  const [fogEnabled, setFogEnabled] = useState(true);
  const [numTrees, setNumTrees] = useState(100);
  const [skyColor, setSkyColor] = useState("#87CEEB");

  return (
    <>
      {/* UI panel */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <div>
          <strong>Camera Mode:</strong>
          <button onClick={() => setCameraMode("orbit")}>Orbit</button>
          <button onClick={() => setCameraMode("fly")}>Fly</button>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={fogEnabled}
              onChange={() => setFogEnabled(!fogEnabled)}
            />{" "}
            Fog
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>
            Number of Trees: {numTrees}
            <input
              type="range"
              min={10}
              max={500}
              value={numTrees}
              onChange={(e) => setNumTrees(parseInt(e.target.value))}
            />
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>
            Sky Color:{" "}
            <input
              type="color"
              value={skyColor}
              onChange={(e) => setSkyColor(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [200, 150, 200], fov: 60 }}
        style={{ width: "100vw", height: "100vh", display: "block" }}
      >
        {/* Background + Fog */}
        <color attach="background" args={[skyColor]} />
        {fogEnabled && <fog attach="fog" args={["#a0c4ff", 50, 500]} />}

        {/* Mặt trời */}
        <directionalLight
          position={[150, 200, 150]}
          intensity={1.2}
          castShadow
          shadow-radius={4}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={500}
          shadow-camera-left={-200}
          shadow-camera-right={200}
          shadow-camera-top={200}
          shadow-camera-bottom={-200}
        />
        <mesh position={[100, 80, 80]}>
          <sphereGeometry args={[40, 32, 32]} />
          <meshBasicMaterial color="yellow" />
        </mesh>

        {/* Scene Objects */}
        <Terrain />
        <RotatingCube />
        <Forest numVisible={numTrees} maxTrees={500} areaSize={200} />
        <Tree position={[5, 0, -5]} scale={1} />
        <Tree position={[-3, 0, 2]} scale={0.8} />
        <Tree position={[0, 0, 0]} scale={1.2} />

        {/* Camera Controls */}
        {cameraMode === "orbit" && <OrbitControls />}
        {cameraMode === "fly" && (
          <FlyControls movementSpeed={10} rollSpeed={Math.PI / 24} dragToLook={true} />
        )}
      </Canvas>
    </>
  );
};

export default Scene;
