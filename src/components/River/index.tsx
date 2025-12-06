import { useMemo } from "react";
import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

const noise = new SimplexNoise();

interface RiverProps {
  width?: number;
  length?: number;
  segments?: number;
  color?: string;
}

const River = ({
  width = 5,
  length = 400,
  segments = 400,
  color = "#1E90FF",
}: RiverProps) => {
  const geometry = useMemo(() => {
    // Tăng segments theo chiều rộng để uốn ngoằn ngoèo đẹp hơn
    const widthSegments = Math.max(2, Math.floor(segments / 20));
    const geom = new THREE.PlaneGeometry(length, width, segments, widthSegments);
    geom.rotateX(-Math.PI / 2);

    const vertices = geom.attributes.position;

    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const z = vertices.getZ(i);

      // Uốn ngoằn ngoèo theo chiều dài và chiều rộng
      const bendX = Math.sin(x / 40 + z / 10) * 2; // bẻ ngang theo x
      const bendZ = Math.sin(x / 50) * 1.5; // uốn nhẹ theo z

      // Sóng nước + noise
      const yBase = Math.sin(x / 20) * 0.2;
      const yNoise = noise.noise(x / 30, z / 30) * 0.3;

      vertices.setX(i, x + bendX);
      vertices.setZ(i, z + bendZ);
      vertices.setY(i, yBase + yNoise);
    }

    geom.computeVertexNormals();
    return geom;
  }, [width, length, segments]);

  return (
    <mesh geometry={geometry} position={[0, 0.05, 0]} receiveShadow>
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

export default River;
