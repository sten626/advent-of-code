import { readFileSync } from 'fs';
import { cycle } from '../shared';

type Wind = '<' | '>';

const leftEdge = Number.parseInt('1000000100000010000001000000', 2);
const rightEdge = Number.parseInt('0000001000000100000010000001', 2);

function blow(rock: number, direction: Wind, towerMask: number): number {
  let newRockPosition = rock;

  switch (direction) {
    case '<':
      if ((rock & leftEdge) === 0) {
        newRockPosition = newRockPosition << 1;
      } else {
        return rock;
      }

      break;
    case '>':
      if ((rock & rightEdge) === 0) {
        newRockPosition = newRockPosition >> 1;
      } else {
        return rock;
      }

      break;
    default:
      throw Error('Invalid wind direction.');
  }

  if ((newRockPosition & towerMask) === 0) {
    return newRockPosition;
  }

  return rock;
}

function dropRock(tower: number[], windGen: Generator<Wind>, rock: number) {
  let height = tower.length + 3;
  let windResult = windGen.next();

  while (!windResult.done) {
    const wind = windResult.value;
    const currentMask = towerMask(tower, height);
    rock = blow(rock, wind, currentMask);

    if (height > tower.length) {
      height -= 1;
    } else if (height === 0 || (rock & towerMask(tower, height - 1)) !== 0) {
      for (const chunk of getShapeChunks(rock)) {
        if (height < tower.length) {
          tower[height] |= chunk;
        } else {
          tower.push(chunk);
        }

        height += 1;
      }

      return;
    } else {
      height -= 1;
    }

    windResult = windGen.next();
  }
}

function dropRock2(
  tower: number[],
  windArray: Wind[],
  windIndex: number,
  rock: number
): number {
  let height = tower.length + 3;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const wind = windArray[windIndex];
    windIndex += 1;

    if (windIndex >= windArray.length) {
      windIndex = 0;
    }

    const currentMask = towerMask(tower, height);
    rock = blow(rock, wind, currentMask);

    if (height > tower.length) {
      height -= 1;
    } else if (height === 0 || (rock & towerMask(tower, height - 1)) !== 0) {
      for (const chunk of getShapeChunks(rock)) {
        if (height < tower.length) {
          tower[height] |= chunk;
        } else {
          tower.push(chunk);
        }

        height += 1;
      }

      return windIndex;
    } else {
      height -= 1;
    }
  }
}

function getShapes(): number[] {
  return [
    '0011110', // -
    '000100000111000001000', // +
    '000010000001000011100', // _|
    '0010000001000000100000010000', // |
    '00110000011000', // square
  ].map((v) => Number.parseInt(v, 2));
}

function* getShapeChunks(shape: number): Generator<number> {
  const shapeBits = shape.toString(2);
  let nBits = shapeBits.length;

  while (nBits > 7) {
    yield Number.parseInt(shapeBits.slice(nBits - 7, nBits), 2);
    nBits -= 7;
  }

  yield Number.parseInt(shapeBits.slice(0, nBits), 2);
}

function getSkyline(tower: number[]): [number, number] {
  let [resultA, resultB] = [0, 0];

  for (const bit of tower.slice(-8, -4)) {
    resultA = resultA << 7;
    resultA |= bit;
  }

  for (const bit of tower.slice(-4)) {
    resultB = resultB << 7;
    resultB |= bit;
  }

  return [resultA, resultB];
}

function main(inputFile: string) {
  const windData = readFileSync(inputFile, { encoding: 'utf-8' }).trim();
  part1(windData);
  part2(windData);
}

function part1(windData: string) {
  const windGen = cycle(windData.split('') as Wind[]);
  const nRocks = 2022;
  const tower: number[] = [];
  let rocksDropped = 0;
  const rockGen = cycle(getShapes());

  while (rocksDropped < nRocks) {
    const result = rockGen.next();
    if (result.done) throw Error('This should never end.');
    const rock = result.value;
    dropRock(tower, windGen, rock);
    rocksDropped += 1;
  }

  console.log(`Part 1: After 2022 rocks height is ${tower.length}`);
}

function part2(windData: string) {
  const nRocks = 1000000000000;
  const rocks = getShapes();
  const seenStates = new Map<string, [number, number]>();
  const tower: number[] = [];
  const windArray = windData.split('') as Wind[];
  let cycleHeight = 0;
  let rocksDropped = 0;
  let windIndex = 0;

  while (rocksDropped < nRocks) {
    const shapeIndex = rocksDropped % rocks.length;
    const rock = rocks[shapeIndex];
    windIndex = dropRock2(tower, windArray, windIndex, rock);
    rocksDropped += 1;

    if (tower.length < 8) {
      continue;
    }

    let skyline = getSkyline(tower);
    const stateKey = `${skyline},${shapeIndex},${windIndex}`;
    const storedState = seenStates.get(stateKey);

    if (storedState === undefined) {
      seenStates.set(stateKey, [rocksDropped, tower.length]);
      continue;
    }

    skyline = getSkyline(tower);
    const [seenRocks, seenTowerHeight] = storedState;
    const nRocksInCycle = rocksDropped - seenRocks;
    const nCycles = Math.floor((nRocks - rocksDropped) / nRocksInCycle);
    rocksDropped += nRocksInCycle * nCycles;
    cycleHeight += nCycles * (tower.length - seenTowerHeight);
    seenStates.clear();
  }

  console.log(
    `Part 2: Tower height is ${tower.length + cycleHeight} units tall.`
  );
}

function towerMask(tower: number[], height: number) {
  if (height >= tower.length) {
    return 0;
  }

  return tower
    .slice(height, height + 4)
    .reverse()
    .reduce((a, b) => (a << 7) | b);
}

main(process.argv[2]);
