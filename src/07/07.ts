const DAY = 7;

type Command = [string[], string[]];
type Input = Command[];

const parseInput = (input: string): Input =>
  input
    .trim()
    .split("\n")
    .reduce<Input>((soFar, value) => {
      if (value.startsWith("$")) {
        soFar.push([value.slice(2).split(" "), []] as Command);
      } else {
        soFar[soFar.length - 1]?.[1].push(value);
      }
      return soFar;
    }, []);

type Node = {
  name: string;
  type: "file" | "dir";
  size: number;
  parent?: Node | null;
  children: Node[] | null;
};

type Walk = { cwd: string[]; node: Node; fs: Node };

const ROOT_NODE: Node = {
  name: "/",
  type: "dir",
  size: 0,
  parent: null,
  children: [] as Node[],
};

const inferFileSystem = (commands: Command[], root: Node) => {
  const { fs, node } = commands.reduce(
    (soFar, [command, output]) => {
      const [exec, ...args] = command;
      const { node, cwd } = soFar;
      if (exec === "cd") {
        const path = args[0]!;
        if (path === "..") {
          cwd.splice(cwd.length - 1, 1);
          const parent = node.parent;
          if (!parent) {
            throw new Error("already root");
          }
          if (node.size == 0) {
            node.size = size_of(node.children!);
          }
          soFar.node = parent;
        } else {
          cwd.push(path);
          const child = node.children?.find((child) => child.name === path);
          if (!child) {
            throw new Error("directory not found");
          }
          soFar.node = child;
        }
      } else if (exec === "ls") {
        const children = output.map<Node>((line) => {
          if (line.startsWith("dir ")) {
            return {
              name: line.slice(4),
              type: "dir",
              size: 0,
              parent: soFar.node,
              children: [],
            };
          } else {
            const [size, name] = line.split(" ");
            return { name: name!, type: "file", size: parseInt(size!), children: null };
          }
        });
        if (children.every(({ type }) => type === "file")) {
          node.size = size_of(children);
        }
        node.children = children;
      }
      return soFar;
    },
    { cwd: [], node: root, fs: root } as Walk
  );
  // walk back to root
  let node_ref = node;
  while (node_ref.parent) {
    node_ref = node_ref.parent;
    node_ref.size = size_of(node_ref.children);
  }
  return fs;
};

export const walk = (node: Node, callback: (node: Node) => void) => {
  callback(node);
  if (node.children) {
    node.children.forEach((child) => walk(child, callback));
  }
};

export const filter = (rootNode: Node, filter: (node: Node) => boolean): Node[] => {
  const list: Node[] = [];
  walk(rootNode, (node) => {
    if (filter(node)) {
      list.push(node);
    }
  });
  return list;
};

export const map = (rootNode: Node, map: (node: Node) => Node): Node[] => {
  const list: Node[] = [];
  walk(rootNode, (node) => {
    list.push(map(node));
  });
  return list;
};

export const solvePartOne = (input: string) => {
  const parsedInput = parseInput(input);
  const fileSystem = inferFileSystem(parsedInput.slice(1), ROOT_NODE);
  return filter(fileSystem, ({ type, size }) => type === "dir" && size <= 100000)
    .map(({ size }) => size)
    .reduce(sum);
};

export const solvePartTwo = (input: string) => {
  const parsedInput = parseInput(input);
  const fileSystem = inferFileSystem(parsedInput.slice(1), ROOT_NODE);
  const sizeToClean = 30000000 - (70000000 - fileSystem.size); // 35201639
  return filter(fileSystem, ({ type, size }) => type === "dir" && size >= sizeToClean)
    .map(({ size }) => size)
    .reduce(min);
};

// helpers

const size_of = (children: Node[] | null): number =>
  children ? children.reduce((soFar, { size }) => soFar + size, 0) : 0;

// const lean = (node: Node): any => ({ ...node, parent: null, children: node.children?.map(lean) });

const sum = (a: number, b: number) => a + b;

const min = (a: number, b: number) => (a < b ? a : b);

// tests

if (import.meta.vitest) {
  const input = await readFile("example", DAY);
  test(`day #${DAY} part one`, () => {
    expect(solvePartOne(input)).toEqual(95437);
  });
  test(`day #${DAY} part two`, () => {
    expect(solvePartTwo(input)).toEqual(24933642);
  });
}
