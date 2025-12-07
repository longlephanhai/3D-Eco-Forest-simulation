import { Canvas } from "@react-three/fiber";
import { OrbitControls, FlyControls } from "@react-three/drei";
import { useState } from "react";

import Terrain from "../Terrain";
import Forest from "../Forest";
import Mountain from "../Mountain";
import River from "../River";
import Celestial from "../Celestial";
import useSeason from "../../hooks/useSeason";



const Scene = () => {
  const [cameraMode, setCameraMode] = useState<"orbit" | "fly">("orbit");
  const [fogEnabled, setFogEnabled] = useState(true);
  const [numTrees, setNumTrees] = useState(100);
  const [skyColor, setSkyColor] = useState("#87CEEB");

  const seasonEffects = {
    spring: {
      fog: ["#c8ffd4", 40, 450],          
      ground: "#6edc7c",                  
      leaf: "#4ecc4e",                    
    },
    summer: {
      fog: ["#6bb6ff", 80, 600],        
      ground: "#4b8f3a",                
      leaf: "#0f6b1f",                 
    },
    autumn: {
      fog: ["#ffcf66", 50, 500],
      ground: "#d9984f",
      leaf: "#cc6f1d",
    },
    winter: {
      fog: ["#eaf8ff", 25, 350],
      ground: "#d8eaf5",
      leaf: "#f0f0f0",
    },
  };



  const { season, nextDay } = useSeason();


  return (
    <>
      {/* UI */}
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
          <strong>Season:</strong> {season}
        </div>

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
      </div>

      {/* Canvas */}
      <Canvas
        shadows
        camera={{ position: [200, 150, 200], fov: 60 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* ⭐ NỀN TRỜI DÙNG TỪ CELESTIAL */}
        <color attach="background" args={[skyColor]} />

        {fogEnabled && (
          <fog
            attach="fog"
            args={[
              seasonEffects[season].fog[0] as string,
              seasonEffects[season].fog[1] as number,
              seasonEffects[season].fog[2] as number,
            ]}
          />
        )}

        <Celestial setSkyColor={setSkyColor} onCycle={nextDay} />

        <Terrain groundColor={seasonEffects[season].ground} />
        <River width={6} length={400} />

        <Forest
          numVisible={numTrees}
          maxTrees={500}
          areaSize={200}
          leafColor={seasonEffects[season].leaf}
        />

        <Mountain position={[50, 0, -50]} scale={20} />
        <Mountain position={[-80, 0, 70]} scale={30} />
        <Mountain position={[0, 0, 100]} scale={25} />

        {cameraMode === "orbit" && <OrbitControls />}
        {cameraMode === "fly" && (
          <FlyControls movementSpeed={10} rollSpeed={Math.PI / 24} dragToLook />
        )}
      </Canvas>

    </>
  );
};

export default Scene;
