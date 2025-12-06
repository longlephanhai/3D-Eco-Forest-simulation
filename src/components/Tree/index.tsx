const Tree = ({ position = [0, 0, 0] as [number, number, number], scale = 1 }) => {
  const trunkHeight = 2 * scale;
  const trunkRadius = 0.3 * scale;
  const crownHeight = 3 * scale;
  const crownRadius = 1 * scale;

  return (
    <group position={position}>
      {/* Thân cây */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[trunkRadius, trunkRadius, trunkHeight, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Tán cây */}
      <mesh position={[0, trunkHeight + crownHeight / 2, 0]} castShadow>
        <coneGeometry args={[crownRadius, crownHeight, 16]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
};

export default Tree;
