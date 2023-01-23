const DAY = 9;

enum Dir {
  Up = "U",
  Right = "R",
  Left = "L",
  Down = "D",
}
type Pos = [number, number];
type Move = [Dir, number];
type Input = Move[];

type Game = {
  board: (string | number)[][];
  rope: Pos[];
  start: Pos;
};

const PRISTINE_VALUE = ".";
const HEAD_VISITED_VALUE = "*";
const TAIL_VISITED_VALUE = "#";

const parseInput = (input: string): Input =>
  input
    .trim()
    .split("\n")
    .map((line) => {
      const [dir, len] = line.split(" ");
      return [dir as Dir, parseInt(len!)];
    });

const follow = (parent: Pos, child: Pos) => {
  // const dist = distance(parent, child);
  const sqd = squaredDistance(parent, child);
  if (sqd === 0) {
    // same
    return;
  } else if (sqd === 1) {
    // directly close
    return;
  } else if (sqd === 2) {
    // diagonaly close
    return;
  } else if (sqd === 4 || sqd === 8) {
    // horizontal 2 or symetric diag 2
    child[0] = (child[0] + parent[0]) / 2;
    child[1] = (child[1] + parent[1]) / 2;
    return;
  } else if (sqd === 5 || sqd === 9) {
    // asymetric
    if (Math.abs(child[0] - parent[0]) === 2) {
      child[0] = (child[0] + parent[0]) / 2;
      child[1] = parent[1];
      return;
    } else {
      child[0] = parent[0];
      child[1] = (child[1] + parent[1]) / 2;
      return;
    }
  }
};

const applyMove = (game: Game, dir: Dir) => {
  const { rope } = game;
  const [head, ...rest] = rope;
  switch (dir) {
    case Dir.Up: {
      head![0]--;
      break;
    }
    case Dir.Right: {
      head![1]++;
      break;
    }
    case Dir.Down: {
      head![0]++;
      break;
    }
    case Dir.Left: {
      head![1]--;
      break;
    }
  }
  rest.forEach((value, index) => follow(rope[index]!, value));
  setGameValue(game, rope[0]![0], rope[0]![1], HEAD_VISITED_VALUE, false);
  setGameValue(
    game,
    rope[rope.length - 1]![0],
    rope[rope.length - 1]![1],
    TAIL_VISITED_VALUE,
    true
  );
};

const setGameValue = (
  game: Game,
  _y: number,
  _x: number,
  value: number | string,
  overwrite = true
) => {
  const { board, rope, start } = game;
  let y = _y;
  let x = _x;
  if (isUndefined(board[y])) {
    const array = new Array(board[0]?.length ?? 0).fill(PRISTINE_VALUE);
    if (y > 0) {
      board[y] = array;
    } else {
      board.unshift(array);
      rope.forEach((value) => {
        value[0]++;
      });
      start[0]++;
      y++;
    }
  }
  if (isUndefined(board[y]![x])) {
    if (x > 0) {
      board.forEach((line) => line.push(PRISTINE_VALUE));
    } else {
      board.forEach((line) => line.unshift(PRISTINE_VALUE));
      rope.forEach((value) => {
        value[1]++;
      });
      start[1]++;
      x++;
    }
  }
  if (overwrite || board[y]![x] === PRISTINE_VALUE) {
    board[y]![x] = value;
  }
};

const boardInitSize = 1;
const start: Pos = [0, 0];

export const solvePartOne = (input: string) => {
  const ropeLength = 2;
  const parsedInput = parseInput(input);
  const board = new Array(boardInitSize)
    .fill(null)
    .map(() => new Array(boardInitSize).fill(PRISTINE_VALUE));
  const rope: Pos[] = new Array(ropeLength).fill(null).map(() => [...start]);
  const game: Game = {
    board,
    start,
    rope,
  };
  parsedInput.forEach(([dir, len]) => {
    for (let i = 0; i < len; i++) {
      applyMove(game, dir);
      if (IS_TEST) {
        debugGame(game);
      }
    }
  });
  return matrixCount(board, TAIL_VISITED_VALUE);
};

export const solvePartTwo = (input: string) => {
  const ropeLength = 10;
  const parsedInput = parseInput(input);
  const board = new Array(boardInitSize)
    .fill(null)
    .map(() => new Array(boardInitSize).fill(PRISTINE_VALUE));
  const rope: Pos[] = new Array(ropeLength).fill(null).map(() => [...start]);
  const game: Game = {
    board,
    start,
    rope,
  };
  parsedInput.forEach(([dir, len]) => {
    for (let i = 0; i < len; i++) {
      applyMove(game, dir);
      if (IS_TEST) {
        debugGame(game);
      }
    }
  });
  return matrixCount(board, TAIL_VISITED_VALUE);
};

// helpers

const isUndefined = (maybeUndefined: unknown): maybeUndefined is undefined =>
  typeof maybeUndefined === "undefined";

const matrixCount = <T>(matrix: T[][], search: T) =>
  matrix.reduce(
    (soFar, line) =>
      soFar + line.reduce<number>((soFar, value) => (soFar += value === search ? 1 : 0), 0),
    0
  );

const squaredDistance = (a: Pos, b: Pos) => {
  return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);
};

const debugGame = (game: Game) => {
  const board = structuredClone(game.board);
  const rope = structuredClone(game.rope);
  const { start } = game;
  board[start[0]]![start[1]] = "S";
  rope.reverse().forEach(([y, x], index) => {
    if (!index) {
      board[y]![x] = "T";
    } else if (index < rope.length - 1) {
      board[y]![x] = `${rope.length - 1 - index}`;
    } else {
      board[y]![x] = "H";
    }
  });
  d(board);
};

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual(13);
  });
  test(`day #${DAY} part two`, () => {
    expect(solvePartTwo(input)).toEqual(1);
  });
}
