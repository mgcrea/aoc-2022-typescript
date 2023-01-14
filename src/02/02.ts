type OpponentMove = "A" | "B" | "C";
type PlayerMove = "X" | "Y" | "Z";
type Round = [OpponentMove, PlayerMove];
type Input = Round[];

const LOSE_SCORE = 0;
const DRAW_SCORE = 3;
const WIN_SCORE = 6;

const parseInput = (input: string): Input =>
  input
    .trim()
    .split("\n")
    .filter((line) => line.match(/^[ABC] [XYZ]$/))
    .map((line) => line.split(" ")) as Input;

const sum = (a: number, b: number) => a + b;

const computeScorePartOne = ([a, b]: Round): number => {
  switch (b) {
    case "X": {
      switch (a) {
        case "A":
          return DRAW_SCORE + 1;
        case "B":
          return LOSE_SCORE + 1;
        case "C":
          return WIN_SCORE + 1;
      }
    }
    case "Y": {
      switch (a) {
        case "A":
          return WIN_SCORE + 2;
        case "B":
          return DRAW_SCORE + 2;
        case "C":
          return LOSE_SCORE + 2;
      }
    }
    case "Z": {
      switch (a) {
        case "A":
          return LOSE_SCORE + 3;
        case "B":
          return WIN_SCORE + 3;
        case "C":
          return DRAW_SCORE + 3;
      }
    }
  }
};

export const solvePartOne = (input: string) =>
  parseInput(input).map(computeScorePartOne).reduce(sum);

const computeScorePartTwo = ([a, b]: Round): number => {
  switch (a) {
    case "A": {
      switch (b) {
        case "X":
          return LOSE_SCORE + 3;
        case "Y":
          return DRAW_SCORE + 1;
        case "Z":
          return WIN_SCORE + 2;
      }
    }
    case "B": {
      switch (b) {
        case "X":
          return LOSE_SCORE + 1;
        case "Y":
          return DRAW_SCORE + 2;
        case "Z":
          return WIN_SCORE + 3;
      }
    }
    case "C": {
      switch (b) {
        case "X":
          return LOSE_SCORE + 2;
        case "Y":
          return DRAW_SCORE + 3;
        case "Z":
          return WIN_SCORE + 1;
      }
    }
  }
};

export const solvePartTwo = (input: string) =>
  parseInput(input).map(computeScorePartTwo).reduce(sum);
