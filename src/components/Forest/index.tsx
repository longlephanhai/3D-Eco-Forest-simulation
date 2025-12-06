import Tree from "../Tree";
import { useMemo } from "react";

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const generateTrees = (numTrees: number, areaSize: number) => {
  const trees: Array<{ position: [number, number, number]; scale: number; rotationY: number }> = [];
  for (let i = 0; i < numTrees; i++) {
    const x = randomRange(-areaSize / 2, areaSize / 2);
    const z = randomRange(-areaSize / 2, areaSize / 2);
    const scale = randomRange(0.8, 1.5);
    const rotationY = randomRange(0, Math.PI * 2);
    trees.push({ position: [x, 0, z] as [number, number, number], scale, rotationY });
  }
  return trees;
};

interface ForestProps {
  maxTrees?: number;
  numVisible?: number;
  areaSize?: number;
}

const Forest = ({ maxTrees = 500, numVisible = 100, areaSize = 200 }: ForestProps) => {
  // Tạo rừng 1 lần
  const trees = useMemo(() => generateTrees(maxTrees, areaSize), [maxTrees, areaSize]);

  return (
    <>
      {trees.map((tree, idx) => (
        <group
          key={idx}
          position={tree.position}
          rotation={[0, tree.rotationY, 0]}
          visible={idx < numVisible} // chỉ hiển thị numVisible cây
        >
          <Tree scale={tree.scale} />
        </group>
      ))}
    </>
  );
};

export default Forest;
