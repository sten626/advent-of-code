import { readFileSync } from 'fs';
import { enumerate, range } from '../../shared';

const numberRegex = /\d+/g;

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  part1(input);
  part2(input);
}

function part1(input: string) {
  const symbolRegex = /[^\d.]/;
  const lines = input.split('\n');
  let lineNum = 0;
  let sum = 0;

  for (const line of lines) {
    const startY = Math.max(0, lineNum - 1);
    const endY = Math.min(lines.length - 1, lineNum + 1);

    for (const match of line.matchAll(numberRegex)) {
      const index = match.index;

      if (index === undefined) {
        throw new Error(`Error parsing line: ${line}`);
      }

      const partNumber = match[0];
      const startX = Math.max(0, index - 1);
      const endX = Math.min(line.length, index + partNumber.length);

      for (const y of range(startY, endY + 1)) {
        const stringToCheck = lines[y].substring(startX, endX + 1);

        if (stringToCheck.match(symbolRegex)) {
          sum += Number.parseInt(partNumber);
          break;
        }
      }
    }

    lineNum++;
  }

  console.log(sum);
}

function part2(input: string) {
  const gearRegex = /\*/g;
  const lines = input.split('\n');
  let sum = 0;

  for (const [lineNum, line] of enumerate(lines)) {
    for (const match of line.matchAll(gearRegex)) {
      const gearPosition = match.index;

      if (gearPosition === undefined) {
        continue;
      }

      const startY = Math.max(0, lineNum - 1);
      const endY = Math.min(lines.length - 1, lineNum + 1);
      const adjacentNumbers: number[] = [];

      for (const y of range(startY, endY + 1)) {
        const lineToCheck = lines[y];
        for (const match of lineToCheck.matchAll(numberRegex)) {
          const index = match.index;

          if (index === undefined) {
            continue;
          }

          const minX = Math.max(0, index - 1);
          const maxX = Math.min(
            lineToCheck.length - 1,
            index + match[0].length,
          );

          if (minX <= gearPosition && gearPosition <= maxX) {
            adjacentNumbers.push(Number.parseInt(match[0]));
          }
        }
      }

      if (adjacentNumbers.length === 2) {
        sum += adjacentNumbers[0] * adjacentNumbers[1];
      }
    }
  }

  console.log(sum);
}

main(process.argv[2]);
