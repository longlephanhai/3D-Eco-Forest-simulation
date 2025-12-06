import { Canvas } from "@react-three/fiber";
import { OrbitControls, FlyControls } from "@react-three/drei";
import { useState } from "react";
import Terrain from "../Terrain";
import Forest from "../Forest";
import Mountain from "../Mountain";
import River from "../River";

const Scene = () => {
  const [cameraMode, setCameraMode] = useState<"orbit" | "fly">("orbit");
  const [fogEnabled, setFogEnabled] = useState(true);
  const [numTrees, setNumTrees] = useState(100);
  const [skyColor, setSkyColor] = useState("#87CEEB");

  return (
    <>
      {/* UI Panel */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, backgroundColor: "rgba(255,255,255,0.8)", padding: "10px", borderRadius: "8px" }}>
        <div>
          <strong>Camera Mode:</strong>
          <button onClick={() => setCameraMode("orbit")}>Orbit</button>
          <button onClick={() => setCameraMode("fly")}>Fly</button>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>
            <input type="checkbox" checked={fogEnabled} onChange={() => setFogEnabled(!fogEnabled)} /> Fog
          </label>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>
            Number of Trees: {numTrees}
            <input type="range" min={10} max={500} value={numTrees} onChange={(e) => setNumTrees(parseInt(e.target.value))} />
          </label>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>
            Sky Color:{" "}
            <input type="color" value={skyColor} onChange={(e) => setSkyColor(e.target.value)} />
          </label>
        </div>
      </div>

      {/* Canvas */}
      <Canvas shadows camera={{ position: [200, 150, 200], fov: 60 }} style={{ width: "100vw", height: "100vh" }}>
        <color attach="background" args={[skyColor]} />
        {fogEnabled && <fog attach="fog" args={["#a0c4ff", 50, 500]} />}

        {/* Sun */}
        <directionalLight position={[150, 200, 150]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <mesh position={[100, 80, 80]}>
          <sphereGeometry args={[40, 32, 32]} />
          <meshBasicMaterial color="yellow" />
        </mesh>

        {/* Scene Objects */}
        <Terrain />
        <River width={6} length={400} />
        <Forest numVisible={numTrees} maxTrees={500} areaSize={200} />
        <Mountain position={[50, 0, -50]} scale={20} />
        <Mountain position={[-80, 0, 70]} scale={30} />
        <Mountain position={[0, 0, 100]} scale={25} />

        {/* Camera */}
        {cameraMode === "orbit" && <OrbitControls />}
        {cameraMode === "fly" && <FlyControls movementSpeed={10} rollSpeed={Math.PI / 24} dragToLook />}
      </Canvas>
    </>
  );
};

export default Scene;
