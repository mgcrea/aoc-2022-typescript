```sh
export DAY=09
aoc download --overwrite --day ${DAY} --input-file src/inputs/${DAY}.txt --puzzle-file src/puzzles/${DAY}.md
cp src/bin/00.ts src/bin/${DAY}.ts
touch src/examples/${DAY}.txt
```
