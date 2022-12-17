import { readFileSync } from 'node:fs';

type WorldSymbol = 'o' | '#';

function fillCave(
  world: Map<string, WorldSymbol>,
  maxY: number,
  floor = false
): number {
  let caveFilling = true;
  let settledSand = 0;

  while (caveFilling) {
    let [x, y] = [500, 0];
    let falling = true;

    if (world.get(`${x},${y}`) === 'o') {
      // Sand is blocked
      caveFilling = false;
      break;
    }

    while (falling) {
      // Check if it fell off
      if (!floor && y > maxY) {
        caveFilling = false;
        break;
      }

      // If right above the floor, settle.
      if (floor && maxY + 2 === y + 1) {
        world.set(`${x},${y}`, 'o');
        settledSand += 1;
        falling = false;
        break;
      }

      // Check down
      if (!world.get(`${x},${y + 1}`)) {
        y += 1;
        continue;
      }
      // Check down-left
      if (!world.get(`${x - 1},${y + 1}`)) {
        x -= 1;
        y += 1;
        continue;
      }
      // Check down-right
      if (!world.get(`${x + 1},${y + 1}`)) {
        x += 1;
        y += 1;
        continue;
      }

      // Can't move; settle
      world.set(`${x},${y}`, 'o');
      settledSand += 1;
      falling = false;
    }
  }

  return settledSand;
}

function part1(inputFile: string) {
  const [world, maxY] = parseWorldMap(inputFile);
  const settledSand = fillCave(world, maxY);
  console.log(`Part 1: ${settledSand} sand units settled.`);
}

function part2(inputFile: string) {
  const [world, maxY] = parseWorldMap(inputFile);
  const settledSand = fillCave(world, maxY, true);
  console.log(`Part 2: ${settledSand} sand units settled.`);
}

function main(inputFile: string) {
  part1(inputFile);
  part2(inputFile);
}

function parseWorldMap(inputFile: string): [Map<string, WorldSymbol>, number] {
  const data = readFileSync(inputFile, { encoding: 'utf-8' }).trim();
  let maxY = -Infinity;
  const world = new Map<string, WorldSymbol>();

  for (const line of data.split('\n')) {
    const coords = line
      .split(' -> ')
      .map((coord) => coord.split(',').map((pos) => Number.parseInt(pos)));
    let [x, y] = coords[0];
    maxY = Math.max(maxY, y);
    world.set(`${x},${y}`, '#');

    for (const [x2, y2] of coords.slice(1)) {
      maxY = Math.max(maxY, y2);

      while (x !== x2 || y !== y2) {
        if (x < x2) {
          x += 1;
        } else if (x > x2) {
          x -= 1;
        } else if (y < y2) {
          y += 1;
        } else if (y > y2) {
          y -= 1;
        } else {
          throw Error('Something horrible has happened.');
        }

        world.set(`${x},${y}`, '#');
      }
    }
  }

  return [world, maxY];
}

main(process.argv[2]);
