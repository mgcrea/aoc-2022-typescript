const DAY = 8;

type Input = number[][];

const parseInput = (input: string): Input =>
  input
    .trim()
    .split("\n")
    .map((line) => line.split("").map((v) => parseInt(v)));

export const solvePartOne = (input: string) => {
  const matrix = parseInput(input);
  let total = 0;
  forEachMatrix(sliceMatrix(matrix, 1, -1), (y, x, _v, h, w, m) => {
    // from west
    const w_los = matrix[y + 1]![0]!;
    const w_view = sliceMatrixLine(m, y, 0, x + 1, Cardinal.east);
    if (hasFullVisibility(w_view, w_los)) {
      total += 1;
      return;
    }

    // from north
    const n_los = matrix[0]![x + 1]!;
    const n_view = sliceMatrixLine(m, 0, x, y + 1, Cardinal.south);
    if (hasFullVisibility(n_view, n_los)) {
      total += 1;
      return;
    }

    // from east
    const e_los = matrix[y + 1]![w + 1]!;
    const e_view = sliceMatrixLine(m, y, w, w - x, Cardinal.west);
    if (hasFullVisibility(e_view, e_los)) {
      total += 1;
      return;
    }

    // from south
    const s_los = matrix[h + 1]![x + 1]!;
    const s_view = sliceMatrixLine(m, h, x, h - y, Cardinal.north);
    if (hasFullVisibility(s_view, s_los)) {
      total += 1;
      return;
    }
  });
  return total + 4 * matrix.length - 4;
};

export const solvePartTwo = (input: string) => {
  const matrix = parseInput(input);
  let max = 0;
  forEachMatrix(matrix, (y, x, v, h, w, m) => {
    let total = 1;

    // to east
    const e_view = sliceMatrixLine(m, y, x + 1, w, Cardinal.east);
    const e_total = visibleCount(e_view, v);
    total *= e_total;

    // to south
    const s_view = sliceMatrixLine(m, y + 1, x, h, Cardinal.south);
    const s_total = visibleCount(s_view, v);
    total *= s_total;

    // to west
    const w_view = sliceMatrixLine(m, y, x, w, Cardinal.west);
    const w_total = visibleCount(w_view, v);
    total *= w_total;

    // to north
    const n_view = sliceMatrixLine(m, y, x, h, Cardinal.north);
    const n_total = visibleCount(n_view, v);
    total *= n_total;

    if (total > max) {
      max = total;
    }
  });
  return max;
};

// helpers

enum Cardinal {
  north,
  south,
  east,
  west,
}

const sliceMatrixLine = <T>(matrix: T[][], y: number, x: number, e: number, car: Cardinal): T[] => {
  switch (car) {
    case Cardinal.north:
      return matrix
        .map((line) => line[x]!)
        .reverse()
        .slice(matrix.length - y, e);
    case Cardinal.south:
      return matrix.map((line) => line[x]!).slice(y, e);
    case Cardinal.east:
      return matrix[y]!.slice(x, e);
    case Cardinal.west:
      return matrix[y]!.slice()
        .reverse()
        .slice(matrix.length - x, e);
  }
};

const sliceMatrix = <T>(matrix: T[][], start?: number, end?: number): T[][] =>
  matrix.slice(start, end).map((line) => line.slice(start, end));

const forEachMatrix = <T>(
  matrix: T[][],
  callback: (y: number, x: number, v: T, h: number, w: number, m: T[][]) => void
): void => {
  const h = matrix.length;
  for (let y = 0; y < matrix.length; y++) {
    const w = matrix[y]!.length;
    for (let x = 0; x < w; x++) {
      callback(y, x, matrix[y]![x]!, h, w, matrix);
    }
  }
};

const hasFullVisibility = (view: number[], los = 0) => {
  const target = view[view.length - 1]!;
  return los < target && Math.max(...view.slice(0, view.length - 1)) < target;
};

const visibleCount = (view: number[], los = 0) => {
  let count = 0;
  for (let i = 0; i < view.length; i++) {
    count++;
    if (view[i]! >= los) {
      break;
    }
  }
  return count;
};

// tests

if (import.meta.vitest) {
  const example = await readFile("example", DAY);
  test(`day #${DAY} part one example`, () => {
    expect(solvePartOne(example)).toEqual(21);
  });
  test(`day #${DAY} part two example`, () => {
    expect(solvePartTwo(example)).toEqual(8);
  });
  // const input = await readFile("input", DAY);
  // test(`day #${DAY} part one input`, () => {
  //   expect(solvePartOne(input)).toEqual(1533);
  // });
  // test(`day #${DAY} part two input`, () => {
  //   expect(solvePartTwo(input)).toEqual(345744);
  // });
}
