```sh
export DAY=03
mkdir src/${DAY}
aoc download --overwrite --day ${DAY} --input-file src/${DAY}/${DAY}.input.txt --puzzle-file src/${DAY}/${DAY}.puzzle.md
touch src/${DAY}/${DAY}.example.txt
cp src/00/00.tpl.ts src/${DAY}/${DAY}.ts
cp src/00/00.test.tpl.ts src/${DAY}/${DAY}.test.ts
```
