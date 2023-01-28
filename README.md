# Advent of Code 2022 in TypeScript

This repository tracks my attempt to solve the [Advent of Code 2022](https://adventofcode.com/2022) using only vanilla [TypeScript](https://www.typescriptlang.org), no external libraries allowed.

## Quickstart

Download a new daily challenge:

```sh
export DAY=11
aoc download --overwrite --day ${DAY} --input-file src/inputs/${DAY}.txt --puzzle-file src/puzzles/${DAY}.md
cp -u src/bin/00.ts src/bin/${DAY}.ts
touch src/examples/${DAY}.txt
```

Work on the new challenge:

```sh
npm test src/bin/${DAY}.ts
```

## Benchmark

You can easily benchmark your solution for a specific puzzle:

```sh
DAY=${DAY} PART=1 ROUNDS=10000 npm start
```

120056 (elapsed: ~218.04µs for 10000 rounds)
