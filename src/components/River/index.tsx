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
  segments = 200,
  color = "#1E90FF",
}: RiverProps) => {
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(length, width, segments, 1);
    geom.rotateX(-Math.PI / 2);

    const vertices = geom.attributes.position;

    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i); // trục dài
      const z = vertices.getZ(i); // trục ngang
      const row = i % (segments + 1); // vị trí ngang

      // offset theo noise để sông ngoằn ngoèo
      const zOffset = noise.noise(x / 50, 0) * 5; // điều chỉnh 5 để rộng cong
      const yBase = 0.05; // nhấp nhô nhẹ
      const yNoise = noise.noise(x / 30, z / 10) * 0.2;

      vertices.setZ(i, z + zOffset); // dịch z
      vertices.setY(i, yBase + yNoise); // cao độ
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
