interface MountainProps {
  position?: [number, number, number];
  scale?: number;
}

const Mountain = ({ position = [0, 0, 0], scale = 20 }: MountainProps) => (
  <mesh position={position} castShadow receiveShadow>
    <coneGeometry args={[scale, scale * 2, 32]} />
    <meshStandardMaterial color="#8B4513" />
  </mesh>
);

export default Mountain;
