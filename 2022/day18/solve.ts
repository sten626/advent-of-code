import { readFileSync } from 'node:fs';

type Point = [number, number, number];

class PointSet {
  private map = new Map<string, Point>();

  constructor(iterable?: Iterable<Point>) {
    if (iterable !== undefined) {
      for (const point of iterable) {
        this.map.set(`${point}`, point);
      }
    }
  }

  [Symbol.iterator]() {
    return this.map.values();
  }

  add(point: Point): this {
    this.map.set(`${point}`, point);
    return this;
  }

  clear(): void {
    this.map.clear();
  }

  delete(point: Point): boolean {
    return this.map.delete(`${point}`);
  }

  difference(other: PointSet): PointSet {
    const result = new PointSet(this);

    for (const point of other) {
      result.delete(point);
    }

    return result;
  }

  has(point: Point): boolean {
    return this.map.has(`${point}`);
  }

  get size(): number {
    return this.map.size;
  }
}

function adjacentPoints(droplet: Point): PointSet {
  const adjacent = new PointSet();
  const adjustments = [
    [0, 0, -1],
    [0, 0, 1],
    [0, -1, 0],
    [0, 1, 0],
    [-1, 0, 0],
    [1, 0, 0],
  ];

  for (const [x, y, z] of adjustments) {
    const adjacentPoint: Point = [
      droplet[0] + x,
      droplet[1] + y,
      droplet[2] + z,
    ];

    adjacent.add(adjacentPoint);
  }

  return adjacent;
}

function main(inputFile: string) {
  const data = readFileSync(inputFile, { encoding: 'utf-8' }).trim();
  const droplets = parseDroplets(data);
  let surfaceArea = 0;

  for (const droplet of droplets) {
    surfaceArea += [...adjacentPoints(droplet)].filter(
      (p) => !droplets.has(p)
    ).length;
  }

  console.log(`Part 1: Surface area is ${surfaceArea}`);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const droplet of droplets) {
    minX = Math.min(minX, droplet[0]);
    maxX = Math.max(maxX, droplet[0]);
    minY = Math.min(minY, droplet[1]);
    maxY = Math.max(maxY, droplet[1]);
    minZ = Math.min(minZ, droplet[2]);
    maxZ = Math.max(maxZ, droplet[2]);
  }

  minX -= 1;
  minY -= 1;
  minZ -= 1;
  maxX += 1;
  maxY += 1;
  maxZ += 1;

  const waterPoints = new PointSet();
  const queue: Point[] = [[minX, minY, minZ]];

  while (queue.length > 0) {
    const current = queue.shift() as Point;

    if (waterPoints.has(current)) {
      continue;
    }

    waterPoints.add(current);

    for (const point of adjacentPoints(current)) {
      if (waterPoints.has(point)) {
        continue;
      }

      const [x, y, z] = point;

      if (
        !droplets.has(point) &&
        x >= minX &&
        x <= maxX &&
        y >= minY &&
        y <= maxY &&
        z >= minZ &&
        z <= maxZ
      ) {
        queue.push(point);
      }
    }
  }

  surfaceArea = [...droplets]
    .map((d) => [...adjacentPoints(d)].filter((p) => waterPoints.has(p)).length)
    .reduce((a, b) => a + b);

  console.log(`Part 2: Surface area is ${surfaceArea}`);
}

function parseDroplets(data: string): PointSet {
  const droplets = new PointSet();

  for (const line of data.split('\n')) {
    const values = line.split(',').map((v) => Number.parseInt(v));
    if (values.length !== 3) throw Error('Invalid line parsed');
    droplets.add(values as Point);
  }

  return droplets;
}

main(process.argv[2]);
