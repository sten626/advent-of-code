import { intersection, open } from '../shared';

const priorities: Record<string, number> = {};
let i = 1;

for (const letter of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  priorities[letter] = i++;
}

async function* findCommonItems(
  rucksacks: AsyncGenerator<string[]>
): AsyncGenerator<Set<string>> {
  for await (const [compartment1, compartment2] of rucksacks) {
    const commonItems = intersection(
      new Set(compartment1),
      new Set(compartment2)
    );

    if (commonItems.size > 1) {
      throw Error('Expected only 1 item in common.');
    }

    yield commonItems;
  }
}

async function* findCommonItemsInElfGroups(
  elfGroups: AsyncGenerator<string[]>
): AsyncGenerator<Set<string>> {
  for await (const elfGroup of elfGroups) {
    yield elfGroup
      .map((rucksack) => new Set(rucksack))
      .reduce((a, b) => intersection(a, b));
  }
}

async function* makeElfGroups(
  rucksacks: AsyncGenerator<string>
): AsyncGenerator<string[]> {
  let group = [];

  for await (const rucksack of rucksacks) {
    group.push(rucksack);

    if (group.length === 3) {
      yield group;
      group = [];
    }
  }
}

async function main() {
  process.chdir(__dirname);
  await part1();
  await part2();
}

async function* parseRucksacks(path: string): AsyncGenerator<string> {
  for await (const line of open(path)) {
    yield line;
  }
}

async function part1() {
  console.log('Part 1:');
  const rucksacks = parseRucksacks('input.txt');
  const splitRucksacks = splitRucksacksIntoCompartments(rucksacks);
  const commonItems = findCommonItems(splitRucksacks);
  const sum = await sumOfCommonItemPriorities(commonItems);
  console.log(`Sum of priorities is ${sum}`);
}

async function part2() {
  console.log('Part 2:');
  const rucksacks = parseRucksacks('input.txt');
  const elfGroups = makeElfGroups(rucksacks);
  const commonItemsForGroup = findCommonItemsInElfGroups(elfGroups);
  const sum = await sumOfCommonItemPriorities(commonItemsForGroup);
  console.log(`Sum of priorities is ${sum}`);
}

async function* splitRucksacksIntoCompartments(
  rucksacks: AsyncGenerator<string>
): AsyncGenerator<string[]> {
  for await (const rucksack of rucksacks) {
    const n_items = rucksack.length;
    const halfway = n_items / 2;
    const compartment1 = rucksack.slice(0, halfway);
    const compartment2 = rucksack.slice(halfway);
    yield [compartment1, compartment2];
  }
}

async function sumOfCommonItemPriorities(
  commonItems: AsyncGenerator<Set<string>>
): Promise<number> {
  let sum = 0;

  for await (const commonItemsForSack of commonItems) {
    for (const item of commonItemsForSack) {
      sum += priorities[item];
    }
  }

  return sum;
}

main();
