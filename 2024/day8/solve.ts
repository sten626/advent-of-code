import { readFileSync } from 'fs';

type Point = [number, number];
type Node = string;
type NodeMap = Map<Node, Point[]>;

function findAntinodes(nodes: NodeMap, size: number, part2: boolean): NodeMap {
  const antinodesMap: NodeMap = new Map();

  for (const [node, points] of nodes.entries()) {
    const seenPointKeys = new Set<string>();
    let antinodes = antinodesMap.get(node);
    if (antinodes === undefined) {
      antinodes = [];
      antinodesMap.set(node, antinodes);
    }

    for (const [ai, a] of points.entries()) {
      const rest = points.slice(ai + 1);

      if (part2 && rest.length > 0) {
        for (const point of points) {
          seenPointKeys.add(`${point}`);
          antinodes.push(point);
        }
      }

      for (const b of rest) {
        let nextPoints: Point[];

        if (part2) {
          nextPoints = [
            ...getNextPoints(a, b, size),
            ...getNextPoints(b, a, size),
          ];
        } else {
          nextPoints = [getNextPoint(a, b), getNextPoint(b, a)];
        }

        for (const nextPoint of nextPoints) {
          if (
            nextPoint[0] < 0 ||
            nextPoint[0] >= size ||
            nextPoint[1] < 0 ||
            nextPoint[1] >= size
          ) {
            continue;
          }

          if (seenPointKeys.has(`${nextPoint}`)) {
            continue;
          }

          seenPointKeys.add(`${nextPoint}`);
          antinodes.push(nextPoint);
        }
      }
    }
  }

  return antinodesMap;
}

function getNextPoint(a: Point, b: Point): Point {
  return [2 * b[0] - a[0], 2 * b[1] - a[1]];
}

function* getNextPoints(a: Point, b: Point, size: number): Generator<Point> {
  const xDiff = b[0] - a[0];
  const yDiff = b[1] - a[1];
  let [x, y] = [b[0] + xDiff, b[1] + yDiff];

  while (x >= 0 && x < size && y >= 0 && y < size) {
    yield [x, y];
    x = x + xDiff;
    y = y + yDiff;
  }
}

// function pointDifferences(a: Point, b: Point): Point[] {
//   return [
//     [a[0] - b[0], a[1] - b[1]],
//     [b[0] - a[0], b[1] - a[1]],
//   ];
// }

// function pointAdd(a: Point, b: Point): Point {
//   return [a[0] + b[0], a[1] + b[1]];
// }

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const nodeMap: NodeMap = new Map();
  let size = 0;

  for (const [y, line] of input.split('\n').entries()) {
    size = line.length;

    for (const [x, val] of Array.from(line).entries()) {
      if (val === '.') {
        continue;
      }

      let nodePoints = nodeMap.get(val);
      if (nodePoints === undefined) {
        nodePoints = [];
        nodeMap.set(val, nodePoints);
      }

      nodePoints.push([x, y]);
    }
  }

  // console.log(nodeMap);
  const antinodesMap = findAntinodes(nodeMap, size, false);
  // console.log(antinodesMap);
  const uniqueAntinodes = new Set<string>();

  for (const antinodes of antinodesMap.values()) {
    for (const antinode of antinodes) {
      uniqueAntinodes.add(`${antinode}`);
    }
  }

  console.log(`Part 1: ${uniqueAntinodes.size}`);

  const antinodesMap2 = findAntinodes(nodeMap, size, true);
  const uniqueAntinodes2 = new Set<string>();

  for (const antinodes of antinodesMap2.values()) {
    for (const antinode of antinodes) {
      uniqueAntinodes2.add(`${antinode}`);
    }
  }

  console.log(`Part 2: ${uniqueAntinodes2.size}`);
}

main(process.argv[2]);
