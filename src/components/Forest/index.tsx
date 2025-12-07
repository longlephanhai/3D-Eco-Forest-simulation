import { useMemo } from "react";
import Tree from "../Tree";

interface ForestProps {
  maxTrees?: number;
  numVisible?: number;
  areaSize?: number;
  leafColor?: string;  
}

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

const generateTrees = (numTrees: number, areaSize: number) => {
  const trees = [];
  for (let i = 0; i < numTrees; i++) {
    const x = randomRange(-areaSize / 2, areaSize / 2);
    const z = randomRange(-areaSize / 2, areaSize / 2);
    const scale = randomRange(0.8, 1.5);
    trees.push({ position: [x, 0, z] as [number, number, number], scale });
  }
  return trees;
};

const Forest = ({ maxTrees = 500, numVisible = 100, areaSize = 400, leafColor = "#228B22" }: ForestProps) => {
  const trees = useMemo(
    () => generateTrees(maxTrees, areaSize),
    [maxTrees, areaSize]
  );

  return (
    <>
      {trees.slice(0, numVisible).map((tree, idx) => (
        <Tree key={idx} position={tree.position} scale={tree.scale} leafColor={leafColor} />
      ))}
    </>
  );
};

export default Forest;
