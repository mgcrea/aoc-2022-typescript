import { solvePartOne, solvePartTwo } from "./01/01";
import { readFile } from "./helpers";

const input = await readFile("input", 1);
console.log(`----------\n| Day 01 |\n----------`);
console.log(`🎄 Part 1 🎄`);
console.log(solvePartOne(input));
console.log(`🎄 Part 2 🎄`);
console.log(solvePartTwo(input));
