export const solve = (input: string) => {
  const elves = input.split("\n\n");
  const elvesCalories = elves.map((value) =>
    value.split("\n").reduce((soFar, item) => soFar + parseInt(item), 0)
  );
  const topElfCalories = Math.max(...elvesCalories);
  return topElfCalories;
};

export const solveExtra = (input: string) => {
  const elves = input.split("\n\n");
  const elvesCalories = elves.map((value) =>
    value.split("\n").reduce((soFar, item) => soFar + parseInt(item), 0)
  );
  elvesCalories.sort((a, b) => b - a);
  return elvesCalories.slice(0, 3).reduce((soFar, value) => soFar + value);
};
