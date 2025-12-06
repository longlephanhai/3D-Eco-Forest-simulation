import Tree from "../Tree";

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Tạo mảng cây ngẫu nhiên
const generateTrees = (numTrees = 50, areaSize = 100) => {
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

const Forest = ({ numTrees = 50, areaSize = 100 }) => {
  const trees = generateTrees(numTrees, areaSize);

  return (
    <>
      {trees.map((tree, idx) => (
        <group
          key={idx}
          position={tree.position}
          rotation={[0, tree.rotationY, 0]} 
        >
          <Tree scale={tree.scale} />
        </group>
      ))}
    </>
  );
};

export default Forest;
