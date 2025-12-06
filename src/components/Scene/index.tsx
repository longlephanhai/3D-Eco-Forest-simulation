import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber"
import { useRef } from "react";
import Terrain from "../Terrain";
import Tree from "../Tree";

const RotatingCube = () => {
  const cubeRef = useRef(null);
  return (
    <mesh ref={cubeRef} position={[0, 1, 0]} rotation={[0.5, 0.5, 0]} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}


const Scene = () => {
  return (
    <Canvas shadows camera={{ position: [5, 5, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      <Terrain />
      <RotatingCube />
      <Tree position={[5, 0, -5]} scale={1} />
      <Tree position={[-3, 0, 2]} scale={0.8} />
      <Tree position={[0, 0, 0]} scale={1.2} />
      <OrbitControls />
    </Canvas>

  )
}
export default Scene