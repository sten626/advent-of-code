import { readFileSync } from 'fs';
import { enumerate } from '../../shared';

const numberRegex = /\d+/g;

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const records1 = part1Parse(input);
  race(records1);
  const records2 = part2Parse(input);
  race(records2);
}

function part1Parse(input: string): Map<number, number> {
  const [timeLine, distanceLine] = input.split('\n');
  const times: number[] = [];
  const records = new Map<number, number>();

  for (const match of timeLine.matchAll(numberRegex)) {
    times.push(Number.parseInt(match[0]));
  }

  for (const [i, match] of enumerate(distanceLine.matchAll(numberRegex))) {
    const distance = Number.parseInt(match[0]);
    records.set(times[i], distance);
  }

  return records;
}

function part2Parse(input: string): Map<number, number> {
  const [timeLine, distanceLine] = input.split('\n');
  const records = new Map<number, number>();
  const timeString = Array.from(timeLine.matchAll(numberRegex))
    .map((m) => m[0])
    .reduce((a, b) => a + b);
  const distanceString = Array.from(distanceLine.matchAll(numberRegex))
    .map((m) => m[0])
    .reduce((a, b) => a + b);
  records.set(Number.parseInt(timeString), Number.parseInt(distanceString));
  return records;
}

function race(records: Map<number, number>) {
  let product = 1;

  for (const [totalTime, recordDistance] of records) {
    let a = 0;
    let b = totalTime;
    const times = new Map<number, number>();
    let current = Math.floor((a + b) / 2);
    let firstRecordBreak = Infinity;
    let lastRecordBreak = -Infinity;

    // Bisect down to find the lowest time.
    while (!times.has(current)) {
      const speed = current;
      const distance = (totalTime - current) * speed;
      times.set(current, distance);

      if (distance > recordDistance) {
        firstRecordBreak = Math.min(firstRecordBreak, current);
        lastRecordBreak = Math.max(lastRecordBreak, current);
        b = current;
        current = Math.floor((a + current) / 2);
      } else {
        a = current;
        current = Math.floor((current + b) / 2);
      }
    }

    // Bisect up to find the highest time.
    a = lastRecordBreak;
    b = totalTime;
    current = Math.floor((a + b) / 2);

    while (!times.has(current)) {
      const speed = current;
      const distance = (totalTime - current) * speed;
      times.set(current, distance);

      if (distance > recordDistance) {
        lastRecordBreak = Math.max(lastRecordBreak, current);
        a = current;
        current = Math.floor((current + b) / 2);
      } else {
        b = current;
        current = Math.floor((a + current) / 2);
      }
    }

    const nWays = lastRecordBreak - firstRecordBreak + 1;
    console.log(`${nWays} ways to win the ${totalTime}ms race.`);
    product *= nWays;
  }

  console.log(product);
}

main(process.argv[2]);
