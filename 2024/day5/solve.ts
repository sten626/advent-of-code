import { readFileSync } from 'fs';

type DependencyMap = Map<number, Set<number>>;
type Update = number[];

function fixOrder(update: Update, depMap: DependencyMap): Update {
  let fixedUpdate: Update = [];
  const seen = new Set<number>();

  for (const cur of update) {
    const dependents = depMap.get(cur);

    // No dependents to worry about
    if (dependents === undefined) {
      fixedUpdate.push(cur);
      seen.add(cur);
      continue;
    }

    const seenDependents = dependents.intersection(seen);

    // No dependents earlier in the update
    if (seenDependents.size === 0) {
      fixedUpdate.push(cur);
      seen.add(cur);
      continue;
    }

    // Has dependents earlier that we need to get in front of
    const earliestIndex = fixedUpdate.findIndex((v) => seenDependents.has(v));
    fixedUpdate.splice(earliestIndex, 0, cur);
    seen.add(cur);

    // Make sure update so far is still valid after jumping in
    fixedUpdate = fixOrder(fixedUpdate, depMap);
  }

  return fixedUpdate;
}

function isValid(update: Update, depMap: DependencyMap): boolean {
  const seen = new Set<number>();

  for (const cur of update) {
    const dependents = depMap.get(cur);

    if (dependents === undefined) {
      seen.add(cur);
      continue;
    }

    if (dependents.intersection(seen).size > 0) {
      return false;
    }

    seen.add(cur);
  }

  return true;
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const splitInput = input.split('\n\n');
  // Values must go after 'key'
  const dependenciesMap: DependencyMap = new Map();

  for (const depLine of splitInput[0].split('\n')) {
    const [a, b] = depLine.split('|').map((v) => Number.parseInt(v));
    let dependencies = dependenciesMap.get(a);

    if (dependencies === undefined) {
      dependencies = new Set<number>();
      dependenciesMap.set(a, dependencies);
    }

    dependencies.add(b);
  }

  const updates: Update[] = splitInput[1]
    .split('\n')
    .map((line) => line.split(',').map((v) => Number.parseInt(v)));

  let middlePageSum = 0;
  const badUpdates: Update[] = [];

  for (const update of updates) {
    if (isValid(update, dependenciesMap)) {
      const middle = update[Math.floor(update.length / 2)];
      middlePageSum += middle;
    } else {
      badUpdates.push(update);
    }
  }

  console.log(`Part 1: ${middlePageSum}`);

  const fixedUpdates: Update[] = [];

  for (const update of badUpdates) {
    fixedUpdates.push(fixOrder(update, dependenciesMap));
  }

  const fixedMiddleSum = fixedUpdates
    .map((update) => update[Math.floor(update.length / 2)])
    .reduce((a, b) => a + b);

  console.log(`Part 2: ${fixedMiddleSum}`);
}

main(process.argv[2]);
