import { readFileSync } from 'fs';

const MUL = /mul\((\d+),(\d+)\)/g;
const INST = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

function main(filename: string) {
  const input = readFileSync(filename, { encoding: 'utf-8' }).trim();
  part1(input);
  part2(input);
}

function part1(input: string) {
  const matches = input.matchAll(MUL);
  let result = 0;

  for (const match of matches) {
    const [a, b] = match.slice(1);
    result += Number.parseInt(a) * Number.parseInt(b);
  }

  console.log(result);
}

function part2(input: string) {
  const matches = input.matchAll(INST);
  let enabled = true;
  let result = 0;

  for (const match of matches) {
    switch (match[0]) {
      case 'do()':
        enabled = true;
        break;
      case "don't()":
        enabled = false;
        break;
      default:
        if (enabled) {
          const [a, b] = match.slice(1);
          result += Number.parseInt(a) * Number.parseInt(b);
        }
    }
  }

  console.log(result);
}

main(process.argv[2]);
