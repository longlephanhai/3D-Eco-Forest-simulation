import { useRef } from "react";
import type { Group } from "three";

interface TreeProps {
  position?: [number, number, number];
  scale?: number;
}

const Tree = ({ position = [0, 0, 0], scale = 1 }: TreeProps) => {
  const groupRef = useRef<Group>(null);

  const trunkHeight = 2 * scale;
  const trunkRadius = 0.3 * scale;
  const crownHeight = 3 * scale;
  const crownRadius = 1 * scale;

  return (
    <group ref={groupRef} position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[trunkRadius, trunkRadius, trunkHeight, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Crown */}
      <mesh position={[0, trunkHeight + crownHeight / 2, 0]} castShadow>
        <coneGeometry args={[crownRadius, crownHeight, 16]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
};

export default Tree;
