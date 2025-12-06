import { useMemo } from "react";
import * as THREE from "three";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";

const noise = new SimplexNoise();

export interface TerrainProps {
  size?: number;
  segments?: number;
  heightScale?: number;
  mountainCount?: number;
  mountainHeight?: number;
}

export interface TerrainData {
  mountainPositions: [number, number][];
  getHeight: (x: number, z: number) => number;
}

const Terrain = ({
  size = 400,
  segments = 200,
  heightScale = 15,
  mountainCount = 5,
  mountainHeight = 50,
}: TerrainProps) => {
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    geom.rotateX(-Math.PI / 2);
    const vertices = geom.attributes.position;

    // random các tọa độ núi
    const mountainPositions: [number, number][] = [];
    for (let i = 0; i < mountainCount; i++) {
      const mx = Math.random() * size - size / 2;
      const mz = Math.random() * size - size / 2;
      mountainPositions.push([mx, mz]);
    }

    const getHeight = (x: number, z: number) => {
      let y = noise.noise(x / 50, z / 50) * heightScale;
      mountainPositions.forEach(([mx, mz]) => {
        const dx = x - mx;
        const dz = z - mz;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const radius = 20 + Math.random() * 30;
        if (dist < radius) {
          y += mountainHeight * (1 - dist / radius);
        }
      });
      return y;
    };

    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const z = vertices.getZ(i);
      const y = getHeight(x, z);
      vertices.setY(i, y);
    }

    geom.computeVertexNormals();
    return geom;
  }, [size, segments, heightScale, mountainCount, mountainHeight]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#556B2F" />
    </mesh>
  );
};

export default Terrain;
