```sh
export DAY=07
mkdir src/${DAY}
aoc download --overwrite --day ${DAY} --input-file src/${DAY}/${DAY}.input.txt --puzzle-file src/${DAY}/${DAY}.puzzle.md
cp src/00/00.ts src/${DAY}/${DAY}.ts
touch src/${DAY}/${DAY}.example.txt
```
