import { readFileSync } from 'fs';
import { all, pairwise, range } from '../../shared';

type Level = number;
type PlantReport = Level[];

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const reports: PlantReport[] = input
    .split('\n')
    .map((line) => line.split(/\s/).map((level) => Number.parseInt(level)));
  part1(reports);
  part2(reports);
}

function part1(reports: PlantReport[]) {
  let n_safe = 0;

  for (const report of reports) {
    let ascending = false;
    let descending = false;
    let safe = true;

    for (const [a, b] of pairwise(report.values())) {
      if (a < b) {
        if (descending) {
          safe = false;
          break;
        }
        ascending = true;
      } else if (a > b) {
        if (ascending) {
          safe = false;
          break;
        }
        descending = true;
      }

      const difference = Math.abs(a - b);

      if (difference < 1 || difference > 3) {
        safe = false;
        break;
      }
    }

    if (safe) {
      n_safe += 1;
    }
  }

  console.log(n_safe);
}

function part2(reports: PlantReport[]) {
  let n_safe = 0;

  for (const report of reports) {
    let isSafe = false;

    for (const exclude of range(report.length)) {
      const current = [
        ...report.slice(0, exclude),
        ...report.slice(exclude + 1),
      ];
      const slopes = getSlopes(current);

      if (
        hasConstantSlopeDirection(slopes) &&
        all(slopes.map((s) => Math.abs(s)).map((s) => s >= 1 && s <= 3))
      ) {
        isSafe = true;
        break;
      }
    }

    if (isSafe) {
      n_safe += 1;
    }
  }

  console.log(n_safe);
}

function hasConstantSlopeDirection(slopes: number[]): boolean {
  let ascending = false;
  let descending = false;

  for (const slope of slopes) {
    if (slope > 0) {
      if (descending) {
        return false;
      }

      ascending = true;
    } else if (slope < 0) {
      if (ascending) {
        return false;
      }

      descending = true;
    } else {
      // slope 0
      return false;
    }
  }

  return true;
}

function getSlopes(report: PlantReport): number[] {
  const slopes: number[] = [];

  for (const [a, b] of pairwise(report.values())) {
    const slope = b - a;
    slopes.push(slope);
  }

  return slopes;
}

main(process.argv[2]);
