import { intersection, open, union } from '../shared';

async function main() {
  await part1();
  await part2();
}

async function* parseElfPairSections(
  path: string
): AsyncGenerator<Set<number>[]> {
  for await (const line of open(path)) {
    yield line
      .split(',')
      .map((range) => range.split('-').map((val) => Number.parseInt(val)))
      .map(([start, end]) => {
        const sections = new Set<number>();

        for (let i = start; i <= end; i++) {
          sections.add(i);
        }

        return sections;
      });
  }
}

async function part1() {
  console.log('Part 1');
  const allElfPairSections = parseElfPairSections('input.txt');
  let overlappingSections = 0;

  for await (const elfPairSections of allElfPairSections) {
    if (sectionsOverlapCompletely(elfPairSections)) {
      overlappingSections += 1;
    }
  }

  console.log(
    `There are ${overlappingSections} pairs with overlapping sections`
  );
}

async function part2() {
  console.log('Part 2');
  const allElfPairSections = parseElfPairSections('input.txt');
  let overlappingSections = 0;

  for await (const elfPairSections of allElfPairSections) {
    if (sectionsOverlapAtAll(elfPairSections)) {
      overlappingSections += 1;
    }
  }

  console.log(
    `There are ${overlappingSections} pairs with overlapping sections`
  );
}

function sectionsOverlapCompletely(elfPairSections: Set<number>[]): boolean {
  let maxSize = 0;
  let allSections = new Set<number>();

  for (const sections of elfPairSections) {
    maxSize = Math.max(maxSize, sections.size);
    allSections = union(allSections, sections);
  }

  return maxSize === allSections.size;
}

function sectionsOverlapAtAll(elfPairSections: Set<number>[]): boolean {
  return elfPairSections.reduce((a, b) => intersection(a, b)).size > 0;
}

main();
