import { readFileSync } from 'fs';

type TrailMap = number[][];
type Point = [number, number];

const directions: Point[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function addPoints(a: Point, b: Point): Point {
  return [a[0] + b[0], a[1] + b[1]];
}

function findTrailheads(map: TrailMap): Point[] {
  const trailheads: Point[] = [];

  for (const [y, row] of map.entries()) {
    for (const [x, height] of row.entries()) {
      if (height === 0) {
        trailheads.push([x, y]);
      }
    }
  }

  return trailheads;
}

function rating(
  map: TrailMap,
  point: Point,
  cache: Map<string, number>,
): number {
  // Check if we're at a 9; don't need to cache 9 spots
  const [x, y] = point;
  const height = map[y][x];

  if (height === 9) {
    return 1;
  }

  // Check cache
  const cachedPeaks = cache.get(`${point}`);
  if (cachedPeaks !== undefined) {
    return cachedPeaks;
  }

  // Look for adjacent points increasing height by 1
  const nextHeight = height + 1;
  const size = map.length;
  let numPaths = 0;

  for (const nextPoint of directions.map((d) => addPoints(point, d))) {
    const [i, j] = nextPoint;

    if (i < 0 || i >= size || j < 0 || j >= size) {
      continue;
    }

    const nextPointHeight = map[j][i];

    if (nextPointHeight === nextHeight) {
      numPaths += rating(map, nextPoint, cache);
    }
  }

  cache.set(`${point}`, numPaths);
  return numPaths;
}

function score(
  map: TrailMap,
  point: Point,
  cache: Map<string, Set<string>>,
): Set<string> {
  // Check if we're at a 9; don't need to cache 9 spots
  const [x, y] = point;
  const height = map[y][x];

  if (height === 9) {
    return new Set([`${point}`]);
  }

  // Check cache
  const cachedPeaks = cache.get(`${point}`);
  if (cachedPeaks !== undefined) {
    return cachedPeaks;
  }

  // Look for adjacent points increasing height by 1
  const nextHeight = height + 1;
  const size = map.length;
  let peaks = new Set<string>();

  for (const nextPoint of directions.map((d) => addPoints(point, d))) {
    const [i, j] = nextPoint;

    if (i < 0 || i >= size || j < 0 || j >= size) {
      continue;
    }

    const nextPointHeight = map[j][i];

    if (nextPointHeight === nextHeight) {
      peaks = peaks.union(score(map, nextPoint, cache));
    }
  }

  cache.set(`${point}`, peaks);
  return peaks;
}

function parseMap(input: string): TrailMap {
  return input
    .split('\n')
    .map((line) => [...line].map((v) => Number.parseInt(v)));
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const map = parseMap(input);
  // console.log(map);
  const trailheads = findTrailheads(map);
  // console.log(trailheads);
  const peaks = trailheads.map((th) => score(map, th, new Map()));
  // console.log(peaks);
  const peakScore = peaks.map((p) => p.size).reduce((a, b) => a + b);
  console.log(`Part 1: ${peakScore}`);
  const ratings = trailheads.map((th) => rating(map, th, new Map()));
  const ratingsSum = ratings.reduce((a, b) => a + b);
  console.log(`Part 2: ${ratingsSum}`);
}

main(process.argv[2]);
