import { solvePartOne, solvePartTwo } from "./01/01";
import { readFile } from "./helpers";

const days = [1, 2];

for (const day of days) {
  const date = String(day).padStart(2, "0");
  const input = await readFile("input", day);
  console.log(`----------\n| Day ${date} |\n----------`);
  console.log(`🎄 Part 1 🎄`);
  console.log(solvePartOne(input));
  console.log(`🎄 Part 2 🎄`);
  console.log(solvePartTwo(input));
}
