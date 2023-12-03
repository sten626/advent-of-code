import { readFileSync } from 'node:fs';
import { all, any, range } from '../../shared';

type Point = [number, number];
type Quadrant = [Point, Point];

class SensorBeaconPair {
  private readonly _distance: number;

  constructor(
    public sensor: Point,
    public beacon: Point,
  ) {
    this._distance =
      Math.abs(sensor[0] - beacon[0]) + Math.abs(sensor[1] - beacon[1]);
  }

  get beaconKey(): string {
    return `${this.beacon[0]},${this.beacon[1]}`;
  }

  get distance(): number {
    return this._distance;
  }

  get sensorKey(): string {
    return `${this.sensor[0]},${this.sensor[1]}`;
  }

  canContainUnseenPoints(min: Point, max: Point): boolean {
    const corners: Point[] = [min, [min[0], max[1]], [max[0], min[1]], max];
    const largestDistance = Math.max(
      ...corners.map(
        (c) =>
          Math.abs(c[0] - this.sensor[0]) + Math.abs(c[1] - this.sensor[1]),
      ),
    );

    return largestDistance > this.distance;
  }

  withinSensorRange(point: Point): boolean {
    const distance =
      Math.abs(this.sensor[0] - point[0]) + Math.abs(this.sensor[1] - point[1]);

    return distance <= this._distance;
  }
}

function findDistressBeaconDivideAndConquer(
  map: SensorBeaconPair[],
  minXY: number,
  maxXY: number,
): Point {
  const startMin: Point = [minXY, minXY];
  const startMax: Point = [maxXY, maxXY];
  const stack: Quadrant[] = [[startMin, startMax]];

  while (stack.length > 0) {
    const [min, max] = stack.pop() as Quadrant;

    if (min[0] === max[0] && min[1] === max[1]) {
      if (all(map.map((pair) => !pair.withinSensorRange(min)))) {
        return min;
      }
    } else {
      const midX = Math.floor((min[0] + max[0]) / 2);
      const midY = Math.floor((min[1] + max[1]) / 2);
      const mid: Point = [midX, midY];
      const quadrants: Quadrant[] = [
        [min, mid],
        [
          [mid[0] + 1, min[1]],
          [max[0], mid[1]],
        ],
        [
          [min[0], mid[1] + 1],
          [mid[0], max[1]],
        ],
        [[mid[0] + 1, mid[1] + 1], max],
      ];

      for (const quadrant of quadrants) {
        if (
          quadrant[0][0] > quadrant[1][0] ||
          quadrant[0][1] > quadrant[1][1]
        ) {
          continue;
        }

        if (
          all(
            map.map((pair) =>
              pair.canContainUnseenPoints(quadrant[0], quadrant[1]),
            ),
          )
        ) {
          stack.push(quadrant);
        }
      }
    }
  }

  throw Error('Failed to find.');
}

function main(inputFile: string) {
  const isSample = inputFile === 'sample.txt';
  const map = parse(inputFile);
  part1(map, isSample);
  part2(map, isSample);
}

function parse(inputFile: string): SensorBeaconPair[] {
  const data = readFileSync(inputFile, { encoding: 'utf-8' }).trim();
  const lineRegex =
    /Sensor at x=(-*\d+), y=(-*\d+): closest beacon is at x=(-*\d+), y=(-*\d+)/;
  const pairs: SensorBeaconPair[] = [];

  for (const line of data.split('\n')) {
    const match = line.match(lineRegex);

    if (!match) {
      continue;
    }

    const [sensorX, sensorY, beaconX, beaconY] = match
      .slice(1, 5)
      .map((x) => Number.parseInt(x));
    pairs.push(new SensorBeaconPair([sensorX, sensorY], [beaconX, beaconY]));
  }

  return pairs;
}

function part1(map: SensorBeaconPair[], isSample: boolean) {
  const occupied = new Set<string>();
  const y = isSample ? 20 : 2000000;

  for (const pair of map) {
    occupied.add(pair.beaconKey);
    occupied.add(pair.sensorKey);
  }

  const minX = Math.min(
    ...map.map((pair) => Math.min(pair.sensor[0], pair.beacon[0])),
  );
  const maxX = Math.max(
    ...map.map((pair) => Math.max(pair.sensor[0], pair.beacon[0])),
  );
  const maxRange = Math.max(...map.map((pair) => pair.distance));
  const startX = minX - maxRange;
  const endX = maxX + maxRange;
  let seenPoints = 0;

  for (const x of range(startX, endX + 1)) {
    const position: Point = [x, y];
    const positionKey = `${x},${y}`;

    if (occupied.has(positionKey)) {
      continue;
    }

    if (any(map.map((pair) => pair.withinSensorRange(position)))) {
      seenPoints += 1;
    }
  }

  console.log(
    `Part 1: In row ${y}, ${seenPoints} positions cannot contain a beacon.`,
  );
}

function part2(map: SensorBeaconPair[], isSample: boolean) {
  const minXY = 0;
  const maxXY = isSample ? 20 : 4000000;
  const foundPoint = findDistressBeaconDivideAndConquer(map, minXY, maxXY);
  const tuningFreq = foundPoint[0] * 4000000 + foundPoint[1];

  console.log(`Part 2: Tuning frequency is ${tuningFreq}`);
}

main(process.argv[2]);
