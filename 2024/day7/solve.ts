import { readFileSync } from 'node:fs';

type Operator = '+' | '*' | '||';

function isSolved(testVal: number, numbers: number[], operators: Operator[]) {
  if (numbers.length === 1) {
    return numbers[0] === testVal;
  }

  for (const operator of operators) {
    let nextVal: number;

    if (operator === '||') {
      nextVal = Number.parseInt(`${numbers[0]}${numbers[1]}`);
    } else {
      nextVal = eval(`${numbers[0]} ${operator} ${numbers[1]}`) as number;
    }

    if (isSolved(testVal, [nextVal, ...numbers.slice(2)], operators)) {
      return true;
    }
  }

  return false;
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const equations = input.split('\n').map((line) => {
    const [testVal, numbers] = line.split(': ');
    return [
      Number.parseInt(testVal),
      numbers.split(' ').map((v) => Number.parseInt(v)),
    ] as [number, number[]];
  });
  // console.log(input);

  const result = equations
    .filter(([testVal, numbers]) => isSolved(testVal, numbers, ['+', '*']))
    .map(([testVal, _]) => testVal)
    .reduce((a, b) => a + b);

  console.log(`Part 1: ${result}`);

  const result2 = equations
    .filter(([testVal, numbers]) =>
      isSolved(testVal, numbers, ['+', '*', '||']),
    )
    .map(([testVal, _]) => testVal)
    .reduce((a, b) => a + b);

  console.log(`Part 2: ${result2}`);
}

main(process.argv[2]);
