import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber"
import { useRef } from "react";

const RotatingCube = () => {
  const cubeRef = useRef(null);
  return (
    <mesh ref={cubeRef} rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

const Scene = () => {
  return (
    <Canvas camera={{ position: [5, 5, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <RotatingCube />
      <OrbitControls />
    </Canvas>
  )
}
export default Scene