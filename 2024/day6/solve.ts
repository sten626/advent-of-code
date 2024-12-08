import { readFileSync } from 'fs';

type Point = [number, number];

const directions: Point[] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function walk(
  start: Point,
  obstacles: Set<string>,
  mapSize: number,
): Set<string> {
  /**
   * Returns a set of points that were visited, or empty if we get stuck in a loop.
   */
  let guard = [...start];
  let directionIndex = 0; // Up
  const visited = new Set<string>();
  const visitedPlusDirection = new Set<string>();

  while (
    guard[1] >= 0 &&
    guard[1] < mapSize &&
    guard[0] >= 0 &&
    guard[0] < mapSize
  ) {
    visited.add(`${guard}`);
    let direction = directions[directionIndex];

    if (visitedPlusDirection.has(`${guard}-${direction}`)) {
      return new Set();
    }
    visitedPlusDirection.add(`${guard}-${direction}`);

    let next: Point = [guard[0] + direction[0], guard[1] + direction[1]];

    while (obstacles.has(`${next}`)) {
      directionIndex = (directionIndex + 1) % directions.length;
      direction = directions[directionIndex];
      next = [guard[0] + direction[0], guard[1] + direction[1]];
    }

    guard = next;
  }

  return visited;
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const obstacles = new Set<string>();
  let guard: Point | null = null;
  let size = 0;

  // Get position of guard and obstacles

  input.split('\n').forEach((row, y) => {
    size = row.length;

    Array.from(row).forEach((cur, x) => {
      switch (cur) {
        case '#':
          obstacles.add(`${[x, y]}`);
          break;
        case '^':
          guard = [x, y];
          break;
      }
    });
  });

  if (!guard) {
    throw new Error("Couldn't find guard");
  }

  const start: Point = [...guard];
  const visited = walk(start, obstacles, size);

  console.log(`Part 1: ${visited.size}`);

  let loopCount = 0;

  for (const potential of visited) {
    if (potential === `${start}`) {
      continue;
    }

    if (walk(start, new Set([...obstacles, potential]), size).size === 0) {
      loopCount += 1;
    }
  }

  console.log(`Part 2: ${loopCount}`);
}

main(process.argv[2]);
