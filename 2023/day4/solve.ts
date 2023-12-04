import { readFileSync } from 'fs';
import { enumerate, intersection, range } from '../../shared';

const numberRegex = /\d+/g;

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  part1(input);
  part2(input);
}

function part1(input: string) {
  let sum = 0;

  for (const line of input.split('\n')) {
    const numbers = line.split(': ')[1];
    const [winningNumbersString, myNumbersString] = numbers.split(' | ');
    const winningNumbers = new Set(
      Array.from(winningNumbersString.matchAll(numberRegex)).map(
        (match) => match[0],
      ),
    );
    const myNumbers = new Set(
      Array.from(myNumbersString.matchAll(numberRegex)).map(
        (match) => match[0],
      ),
    );
    const matchedNumbers = intersection(winningNumbers, myNumbers);

    if (matchedNumbers.size > 0) {
      sum += 2 ** (matchedNumbers.size - 1);
    }
  }

  console.log(sum);
}

function part2(input: string) {
  const cardMultipliers = new Map<number, number>();
  let total = 0;

  for (const [i, line] of enumerate(input.split('\n'))) {
    const currentMultiplier = cardMultipliers.get(i) || 1;
    total += currentMultiplier;
    const numbers = line.split(': ')[1];
    const [winningNumbersString, myNumbersString] = numbers.split(' | ');
    const winningNumbers = new Set(
      Array.from(winningNumbersString.matchAll(numberRegex)).map(
        (match) => match[0],
      ),
    );
    const myNumbers = new Set(
      Array.from(myNumbersString.matchAll(numberRegex)).map(
        (match) => match[0],
      ),
    );
    const matchedNumbers = intersection(winningNumbers, myNumbers);

    if (matchedNumbers.size === 0) {
      continue;
    }

    for (const j of range(i + 1, i + matchedNumbers.size + 1)) {
      const multiplier = cardMultipliers.get(j) || 1;
      cardMultipliers.set(j, multiplier + currentMultiplier);
    }
  }

  console.log(total);
}

main(process.argv[2]);
