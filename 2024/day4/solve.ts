import { readFileSync } from 'fs';
import { range } from '../../shared';

function search(
  grid: string[][],
  letters: string[],
  cur: [number, number],
  direction: [number, number],
): boolean {
  if (letters.length < 1) {
    return true;
  }

  const x = cur[0] + direction[0];
  const y = cur[1] + direction[1];

  if (y < 0 || y >= grid.length) {
    return false;
  }

  const row = grid[y];

  if (x < 0 || x >= row.length) {
    return false;
  }

  if (row[x] !== letters[0]) {
    return false;
  }

  return search(grid, letters.slice(1), [x, y], direction);
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const grid = input.split('\n').map((row) => Array.from(row));
  part1(grid);
  part2(grid);
}

function part1(grid: string[][]) {
  let result = 0;
  const height = grid.length;
  const directions: [number, number][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const y of range(height)) {
    const row = grid[y];
    const width = row.length;

    for (const x of range(width)) {
      if (grid[y][x] !== 'X') {
        continue;
      }

      for (const direction of directions) {
        if (search(grid, ['M', 'A', 'S'], [x, y], direction)) {
          result += 1;
        }
      }
    }
  }

  console.log(result);
}

function part2(grid: string[][]) {
  const height = grid.length;
  const counts = new Map<string, number>();
  const directions: [number, number][] = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  for (const y of range(height)) {
    const row = grid[y];
    const width = row.length;

    for (const x of range(width)) {
      if (grid[y][x] !== 'M') {
        continue;
      }

      for (const direction of directions) {
        if (search(grid, ['A', 'S'], [x, y], direction)) {
          const key = `${x + direction[0]}-${y + direction[1]}`;
          const count = counts.get(key);

          if (count === undefined) {
            counts.set(key, 1);
          } else {
            counts.set(key, count + 1);
          }
        }
      }
    }
  }

  console.log([...counts.values()].filter((c) => c > 1).length);
}

main(process.argv[2]);
