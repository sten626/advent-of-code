import { readFileSync } from 'fs';

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  part1(input);
  part2(input);
}

function part1(input: string) {
  const lineRegex = /^\D*(\d)\w*(\d)\D*$/;
  const singleNumRegex = /^\D*(\d)\D*$/;
  let sum = 0;

  for (const line of input.split('\n')) {
    let match = line.match(lineRegex);
    let calValue: string;

    if (match) {
      calValue = match[1] + match[2];
    } else {
      match = line.match(singleNumRegex);

      if (!match) {
        throw new Error(`Invalid line: ${line}`);
      }

      calValue = match[1] + match[1];
    }

    sum += Number.parseInt(calValue);
  }

  console.log(`Part 1: ${sum}`);
}

function part2(input: string) {
  const numberWords = new Map<string, string>([
    ['one', '1'],
    ['two', '2'],
    ['three', '3'],
    ['four', '4'],
    ['five', '5'],
    ['six', '6'],
    ['seven', '7'],
    ['eight', '8'],
    ['nine', '9'],
  ]);
  let sum = 0;

  for (const line of input.split('\n')) {
    const found: string[] = [];

    for (let i = 0; i < line.length; i++) {
      const match = Number.parseInt(line[i]);

      if (Number.isInteger(match)) {
        found.push(line[i]);
        continue;
      }

      for (const [word, number] of numberWords) {
        if (line.substring(i).startsWith(word)) {
          found.push(number);
          break;
        }
      }
    }

    const first = found.shift();

    if (first === undefined) {
      throw new Error(`No numbers found in line: ${line}`);
    }

    let last = found.pop();

    if (last === undefined) {
      last = first;
    }

    const valueString = first + last;
    sum += Number.parseInt(valueString);
  }

  console.log(`Part 2: ${sum}`);
}

main(process.argv[2]);
