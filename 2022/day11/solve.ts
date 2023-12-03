import { open } from '../../shared';

// class Monkey {
//   items: number[] = [];
//   operation = '';

//   constructor(public id: number) {}

//   performOperation(old: number): number {
//     return eval(`${old} ${this.operation}`);
//   }
// }

interface Monkey {
  items: number[];
  operation: string;
  testDivisor: number;
  trueMonkey: number;
  falseMonkey: number;
}

const monkeyRegex = /Monkey (\d+):/;
const itemsRegex = /Starting items: (\d+(,\s*\d+)*)/;
const opRegex = /Operation: new = (old [*+] \w+)/;
const testRegex = /Test: divisible by (\d+)/;
const trueRegex = /If true: throw to monkey (\d+)/;
const falseRegex = /If false: throw to monkey (\d+)/;

async function main(inputFile: string) {
  await part1(inputFile);
  await part2(inputFile);
}

async function parse(inputFile: string): Promise<Monkey[]> {
  const monkeys: Monkey[] = [];
  // let monkeyId = 0;
  let items: number[] = [];
  let operation = '';
  let testDivisor = 0;
  let trueMonkey = 0;
  let falseMonkey = 0;

  for await (const line of open(inputFile)) {
    if (line === '') {
      // End of Monkey.
      monkeys.push({
        items,
        operation,
        testDivisor,
        trueMonkey,
        falseMonkey,
      });
      continue;
    }

    let match = line.match(monkeyRegex);
    if (match) {
      // monkeyId = Number.parseInt(match[1]);
      continue;
    }

    match = line.match(itemsRegex);
    if (match) {
      items = match[1].split(',').map((v) => Number.parseInt(v));
      continue;
    }

    match = line.match(opRegex);
    if (match) {
      operation = match[1];
      continue;
    }

    match = line.match(testRegex);
    if (match) {
      testDivisor = Number.parseInt(match[1]);
      continue;
    }

    match = line.match(trueRegex);
    if (match) {
      trueMonkey = Number.parseInt(match[1]);
      continue;
    }

    match = line.match(falseRegex);
    if (match) {
      falseMonkey = Number.parseInt(match[1]);
      continue;
    }

    throw Error('Unhandled line found');
  }

  monkeys.push({
    items,
    operation,
    testDivisor,
    trueMonkey,
    falseMonkey,
  });

  return monkeys;
}

async function part1(inputFile: string) {
  const monkeys = await parse(inputFile);
  const inspectionCounts = processRounds(20, monkeys, true);
  const monkeyBusiness = [...inspectionCounts.values()]
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b);

  console.log(`Part 1: Monkey business is ${monkeyBusiness}`);
}

async function part2(inputFile: string) {
  const monkeys = await parse(inputFile);
  const inspectionCounts = processRounds(10000, monkeys, false);
  const monkeyBusiness = [...inspectionCounts.values()]
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b);

  console.log(`Part 2: Monkey business is ${monkeyBusiness}`);
}

function processRounds(
  numRounds: number,
  monkeys: Monkey[],
  relaxing: boolean,
): Map<number, number> {
  const inspectionCounts = new Map<number, number>();
  const lcd = monkeys.map((m) => m.testDivisor).reduce((a, b) => a * b);

  for (let round = 0; round < numRounds; round++) {
    for (const [i, monkey] of monkeys.entries()) {
      let item = monkey.items.shift();
      // console.log(`Monkey inspects ${item}.`);

      while (item) {
        item = eval(`let old = item; ${monkey.operation}`);
        const count = inspectionCounts.get(i) || 0;
        inspectionCounts.set(i, count + 1);

        if (item === undefined) {
          throw Error('Eval failed');
        }

        // console.log(`Worry level changes to ${item}.`);

        if (relaxing) {
          item = Math.floor(item / 3);
          // console.log(`Monkey gets bored. Worry level divided by 3 to ${item}.`);
        } else {
          // Reduce the number by lowest common denominator to keeps the numbers from going into FP-error territory.
          item %= lcd;
        }

        if (item % monkey.testDivisor === 0) {
          // console.log(`Worry level divisible by ${monkey.testDivisor}.`);
          monkeys[monkey.trueMonkey].items.push(item);
          // console.log(`Thrown to monkey ${monkey.trueMonkey}.`);
        } else {
          // console.log(`Worry level not divisible by ${monkey.testDivisor}.`);
          monkeys[monkey.falseMonkey].items.push(item);
          // console.log(`Thrown to monkey ${monkey.falseMonkey}.`);
        }

        item = monkey.items.shift();
      }
    }

    // if (round + 1 === 1 || round + 1 === 20 || (round + 1) % 1000 === 0) {
    //   console.log(`== Round ${round + 1} ==`);
    //   console.log(inspectionCounts);
    // }
  }

  return inspectionCounts;
}

main(process.argv[2]);
