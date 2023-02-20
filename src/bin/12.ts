const DAY = 12;

type Pos = [number, number];
type Input = { matrix: number[][]; start: Pos; end: Pos };

type Node<T = { x: number; y: number; v: number }> = {
  label: string;
  distance: number;
  visited: boolean;
  neighbors: Set<Node<T>>;
  meta: T;
};
type Graph = { matrix: Node[][]; start: Node; end: Node };

const parseInput = (input: string): Input => {
  let start: Pos = [0, 0];
  let end: Pos = [0, 0];
  const matrix = input
    .trim()
    .split("\n")
    .map((line, y) =>
      line.split("").map((char, x) => {
        switch (char) {
          case "S":
            start = [y, x];
            return 0;
          case "E":
            end = [y, x];
            return 25;
          default:
            return char.charCodeAt(0) - 97;
        }
      })
    );
  return { matrix, start, end };
};

const parseInputAsGraph = (input: string, inverse = false): Graph => {
  const { matrix, start, end } = parseInput(input);
  let startNode: Node, endNode: Node;
  // Convert elevation map to matrix of nodes
  const nodeMatrix = mapMatrix(matrix, (v, y, x) => {
    const node: Node = {
      distance: Infinity,
      visited: false,
      neighbors: new Set(),
      label: `${y},${x}:${v}`,
      meta: { y, x, v },
    };
    if (y === start[0] && x === start[1]) {
      node.distance = !inverse ? 0 : Infinity;
      startNode = node;
    }
    if (y === end[0] && x === end[1]) {
      node.distance = !inverse ? Infinity : 0;
      endNode = node;
    }
    return node;
  });

  forEachMatrix(nodeMatrix, (node, y, x, h, w, m) => {
    // Build the graph accoding to the elevation rule
    const neighbors = getMatrixNeighbors(m, y, x, h, w).filter((neighbor) =>
      !inverse ? neighbor.meta.v <= node.meta.v + 1 : node.meta.v <= neighbor.meta.v + 1
    );
    addToSet(node.neighbors, neighbors);
  });

  return { matrix: nodeMatrix, start: startNode!, end: endNode! };
};

export const solvePartOne = (input: string) => {
  const { start, end } = parseInputAsGraph(input);
  // Create a set of all the unvisited nodes called the unvisited set
  const unvisited = new Set<Node>();
  runDijkstra(unvisited, start, end);
  return end.distance;
};

export const solvePartTwo = (input: string) => {
  const { matrix, end } = parseInputAsGraph(input, true);
  // Create a set of all the unvisited nodes called the unvisited set
  const unvisited = new Set<Node>();
  runDijkstra(unvisited, end);
  // Find best start
  const { distance } = reduceMatrix(
    matrix,
    (soFar, node) => {
      if (node.meta.v === 0 && node.distance < soFar.distance) {
        soFar.distance = node.distance;
        soFar.node = node;
      }
      return soFar;
    },
    { distance: Infinity, node: null as Node | null }
  );
  return distance;
};

// helpers

/**
 * {@link https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm}
 */
const runDijkstra = (
  unvisited: Set<Node>,
  currentNode: Node,
  endNode?: Node,
  callback?: (prevNode: Node, nextNode: Node) => unknown
): void => {
  // Consider all of its unvisited neighbors
  const neighbors = filterSet(
    currentNode.neighbors,
    (node) => node !== currentNode && !node.visited
  );
  neighbors.forEach((node) => {
    // Add them to the set of unvisited nodes
    unvisited.add(node);
    // Calculate their tentative distances through the current node
    const distance = currentNode.distance + 1;
    // Compare the newly calculated tentative distance to the one currently assigned to the neighbor and assign it the smaller one.
    if (node.distance > distance) {
      node.distance = distance;
    }
  });
  // Mark the current node as visited and remove it from the unvisited set
  currentNode.visited = true;
  unvisited.delete(currentNode);
  // If the destination node has been marked visited, then stop
  if (endNode ? currentNode === endNode : unvisited.size === 0) {
    return;
  }
  // Select the unvisited node that is marked with the smallest tentative distance
  const nextNode = Array.from(unvisited.values())
    .sort((a, b) => a.distance - b.distance)
    .shift()!;

  if (callback) {
    if (callback(currentNode, nextNode)) {
      return;
    }
  }
  return runDijkstra(unvisited, nextNode, endNode, callback);
};

// const printMatrix = (matrix: Node[][], prev?: Node, next?: Node): void => {
//   p(
//     inspect(
//       mapMatrix(matrix, (node) => {
//         let label = "";
//         if (prev && node === prev) {
//           label = `•${node.distance}`;
//         } else if (next && node === next) {
//           label = `*${node.distance}`;
//         } else {
//           label = node.distance === Infinity ? "" : String(node.distance);
//         }
//         // return label;
//         return label.padStart(3, " ");
//       }),
//       { colors: true, compact: true /*, breakLength: Infinity */ }
//     )
//   );
// };

const addToSet = <T>(set: Set<T>, values: T[]) => {
  for (const value of values) {
    set.add(value);
  }
};

const filterSet = <T>(set: Set<T>, callback: (value: T) => boolean): Set<T> => {
  const filteredSet = new Set<T>();
  for (const value of set) {
    if (callback(value)) {
      filteredSet.add(value);
    }
  }
  return filteredSet;
};

const forEachMatrix = <T>(
  matrix: T[][],
  callback: (v: T, y: number, x: number, h: number, w: number, m: T[][]) => void
): void => {
  const h = matrix.length;
  for (let y = 0; y < matrix.length; y++) {
    const w = matrix[y]!.length;
    for (let x = 0; x < w; x++) {
      callback(matrix[y]![x]!, y, x, h, w, matrix);
    }
  }
};

const reduceMatrix = <T, U>(
  matrix: T[][],
  callback: (a: U, v: T, y: number, x: number, h: number, w: number, m: T[][]) => U,
  initialValue: U
): U => {
  let soFar = initialValue;
  forEachMatrix(matrix, (v, y, x, h, w, m) => {
    soFar = callback(soFar, v, y, x, h, w, m);
  });
  return soFar;
};

const mapMatrix = <T, U>(
  matrix: T[][],
  callback: (v: T, y: number, x: number, h: number, w: number, m: T[][]) => U
): U[][] => {
  return reduceMatrix(
    matrix,
    (soFar, v, y, x, h, w, m) => {
      const result = callback(v, y, x, h, w, m);
      if (!soFar[y]) {
        soFar[y] = new Array(w);
      }
      soFar[y]![x] = result;
      return soFar;
    },
    new Array(matrix.length)
  );
};

const getMatrixNeighbors = <T>(matrix: T[][], y: number, x: number, h: number, w: number): T[] => {
  const neighbors = [];
  if (y > 0) {
    neighbors.push(matrix[y - 1]![x]!);
  }
  if (y < h - 1) {
    neighbors.push(matrix[y + 1]![x]!);
  }
  if (x > 0) {
    neighbors.push(matrix[y]![x - 1]!);
  }
  if (x < w - 1) {
    neighbors.push(matrix[y]![x + 1]!);
  }
  return neighbors;
};

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual(31);
  });
  test.only(`day #${DAY} part two`, () => {
    expect(solvePartTwo(input)).toEqual(29);
  });
}
