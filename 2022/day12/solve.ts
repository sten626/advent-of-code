import { open } from '../../shared';

type Position = [number, number];

const heights = new Map(
  'abcdefghijklmnopqrstuvwxyz'.split('').map((v, i) => [v, i + 1]),
);
heights.set('S', 1);
heights.set('E', 26);

async function main(inputFile: string) {
  const [map, start] = await parseMap(inputFile);
  part1(map, start);
  part2(map);
}

async function parseMap(inputFile: string): Promise<[string[][], Position]> {
  const map: string[][] = [];
  let row = 0;
  let startRow = 0;
  let startCol = 0;

  for await (const line of open(inputFile)) {
    const startIndex = line.indexOf('S');

    if (startIndex !== -1) {
      startRow = row;
      startCol = startIndex;
    }

    map.push([...line]);
    row += 1;
  }

  return [map, [startRow, startCol] as Position];
}

function part1(map: string[][], start: Position) {
  const steps = search(map, [start]);
  console.log(`Part 1: Took ${steps} steps.`);
}

function part2(map: string[][]) {
  const allMinHeightSpots: Position[] = [];

  for (const [i, row] of map.entries()) {
    for (const [j, height] of row.entries()) {
      if (height === 'S' || height === 'a') {
        allMinHeightSpots.push([i, j]);
      }
    }
  }

  const steps = search(map, allMinHeightSpots);
  console.log(`Part 2: Shortest path is ${steps} steps.`);
}

function search(map: string[][], start: Position[]): number {
  const queue: Position[] = [];
  const visited = new Map<string, number>();
  const height = map.length;
  const width = map[0].length;

  for (const startingPosition of start) {
    const startKey = startingPosition.join('-');
    visited.set(startKey, 0);
    queue.push(startingPosition);
  }

  while (queue.length > 0) {
    const cur = queue.shift() as Position;
    const [curX, curY] = cur;
    const curHeight = map[curX][curY];
    const key = cur.join('-');
    const depth = visited.get(key) || 0;

    if (curHeight === 'E') {
      return depth;
    }

    for (const [x, y] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const adjX = curX + x;
      const adjY = curY + y;

      if (adjX >= 0 && adjX < height && adjY >= 0 && adjY < width) {
        const adj: Position = [adjX, adjY];
        const adjKey = adj.join('-');

        if (visited.has(adjKey)) {
          continue;
        }

        const adjHeight = map[adjX][adjY];

        if (
          (heights.get(adjHeight) || Infinity) >
          (heights.get(curHeight) || Infinity) + 1
        ) {
          continue;
        }

        visited.set(adjKey, depth + 1);
        queue.push(adj);
      }
    }
  }

  throw Error('Did not find end.');
}

main(process.argv[2]);
