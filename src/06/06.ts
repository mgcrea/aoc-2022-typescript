const DAY = 6;

type Input = number[];

const parseInput = (input: string, _safe?: boolean): Input =>
  input.trim().split("").map(toLowerCharCode);

const findMarkerIndex = (input: Input, size: number) => {
  const marker: number[] = [];
  let markerIndex = 0;
  for (let index = 0; index < input.length; index++) {
    const value = input[index]!;
    if (!marker.includes(value)) {
      marker.push(value);
      if (marker.length === size) {
        markerIndex = index + 1;
        break;
      }
    } else {
      const size = marker.indexOf(value) + 1;
      marker.splice(0, size);
      marker.push(value);
    }
  }
  return markerIndex;
};

export const solvePartOne = (input: string) => findMarkerIndex(parseInput(input), 4);

export const solvePartTwo = (input: string) => findMarkerIndex(parseInput(input), 14);

// helpers

const toLowerCharCode = (char: string) => char.charCodeAt(0) - 97;

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual(7);
  });
  test(`day #${DAY} part two`, () => {
    expect(solvePartTwo("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toEqual(19);
  });
}
