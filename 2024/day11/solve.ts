import { readFileSync } from 'fs';

// function blink(stones: number[]): number[] {
//   const newStones: number[] = [];

//   for (const stone of stones) {
//     newStones.push(...processStone(stone));
//   }

//   return newStones;
// }

function parseStones(input: string): number[] {
  return input.split(' ').map((v) => Number.parseInt(v));
}

function blink(stone: number): number[] {
  const stones: number[] = [];
  const stoneString = stone.toString();
  const numDigits = stoneString.length;

  if (stone === 0) {
    stones.push(1);
  } else if (numDigits % 2 === 0) {
    const middle = numDigits / 2;
    stones.push(
      ...[stoneString.slice(0, middle), stoneString.slice(middle)].map((v) =>
        Number.parseInt(v),
      ),
    );
  } else {
    stones.push(stone * 2024);
  }

  return stones;
}

const processStoneCache = new Map<number, Map<number, number>>();

function processStone(stone: number, blinks: number): number {
  const stoneCache = processStoneCache.get(stone) ?? new Map<number, number>();

  if (stoneCache.has(blinks)) {
    return stoneCache.get(blinks) as number;
  }

  const newStones = blink(stone);
  let numNewStones = newStones.length > 1 ? 1 : 0;

  if (blinks > 1) {
    for (const newStone of newStones) {
      numNewStones += processStone(newStone, blinks - 1);
    }
  }

  stoneCache.set(blinks, numNewStones);
  processStoneCache.set(stone, stoneCache);

  return numNewStones;
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const stones: number[] = parseStones(input);
  let numStones = stones.length;

  for (const stone of stones) {
    numStones += processStone(stone, 25);
  }

  console.log(`Part 1: ${numStones}`);

  numStones = stones.length;

  for (const stone of stones) {
    numStones += processStone(stone, 75);
  }

  console.log(`Part 2: ${numStones}`);
}

main(process.argv[2]);
