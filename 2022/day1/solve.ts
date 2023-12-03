import { open } from '../../shared';

async function main(inputFile: string) {
  const elfCalories = await parseElfCaloriesList(inputFile);
  part1(elfCalories);
  part2(elfCalories);
}

async function parseElfCaloriesList(path: string): Promise<number[]> {
  const elfCalories: number[] = [];
  let sum = 0;

  for await (const line of open(path)) {
    if (line == '') {
      elfCalories.push(sum);
      sum = 0;
    } else {
      sum += Number.parseInt(line);
    }
  }

  return elfCalories;
}

function part1(elfCalories: number[]) {
  const maxCalories = Math.max(...elfCalories);

  console.log(`The elf carrying the most is carrying ${maxCalories} calories.`);
}

function part2(elfCalories: number[]) {
  const sortedElfCalories = [...elfCalories].sort((a, b) => b - a);
  const topThreeSum = sortedElfCalories.slice(0, 3).reduce((a, b) => a + b);

  console.log(`The top three elves are carrying ${topThreeSum} calories.`);
}

main(process.argv[2]);
