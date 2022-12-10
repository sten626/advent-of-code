import { open } from '../shared';

type Instruction = [number, number, number]; // quantity, source, destination

const crateLineRegex = /(\[[A-Z]\]\s*)+/;
const crateRegex = /[A-Z]/g;
const instructionLineRegex = /move (\d+) from (\d) to (\d)/;

function getTopCrates(crateStacks: Map<number, string[]>): string {
  let result = '';

  for (const key of [...crateStacks.keys()].sort()) {
    const stack = crateStacks.get(key);

    if (!stack) {
      throw Error('Invalid stack somehow');
    }

    const crate = stack.at(stack.length - 1);

    if (!crate) {
      throw Error('Empty stack');
    }

    result += crate;
  }

  return result;
}

async function main(inputFile: string) {
  await part1(inputFile);
  await part2(inputFile);
}

async function parse(
  filename: string
): Promise<[Map<number, string[]>, Instruction[]]> {
  const crateStacks = new Map<number, string[]>();
  const instructionQueue: Instruction[] = [];

  for await (const line of open(filename)) {
    if (line.match(crateLineRegex)) {
      let stackNum = 1;
      let start = 0;
      let end = Math.min(4, line.length);

      while (start < end) {
        const chunk = line.substring(start, end);
        const match = chunk.match(crateRegex);

        if (match) {
          let stack = crateStacks.get(stackNum);

          if (!stack) {
            stack = [];
            crateStacks.set(stackNum, stack);
          }

          stack.push(match[0]);
        }

        stackNum += 1;
        start += 4;
        end = Math.min(start + 4, line.length);
      }

      continue;
    }

    const match = line.match(instructionLineRegex);

    if (match) {
      const matchNumbers = match.slice(0, 4).map((val) => Number.parseInt(val));
      const instruction: Instruction = [
        matchNumbers[1],
        matchNumbers[2],
        matchNumbers[3],
      ];
      instructionQueue.push(instruction);
    }
  }

  for (const stack of crateStacks.values()) {
    stack.reverse();
  }

  return [crateStacks, instructionQueue];
}

async function part1(inputFile: string) {
  const [crateStacks, instructionQueue] = await parse(inputFile);
  const result = processInstructions(crateStacks, instructionQueue);
  const topCrates = getTopCrates(result);
  console.log(topCrates);
}

async function part2(inputFile: string) {
  const [crateStacks, instructionQueue] = await parse(inputFile);
  const result = processInstructions2(crateStacks, instructionQueue);
  const topCrates = getTopCrates(result);
  console.log(topCrates);
}

function processInstructions(
  crateStacks: Map<number, string[]>,
  instructionQueue: Instruction[]
): Map<number, string[]> {
  const result = new Map<number, string[]>();

  for (const [key, value] of crateStacks) {
    result.set(key, [...value]);
  }

  let instruction = instructionQueue.shift();

  while (instruction) {
    let [quantity] = instruction;
    const [, src, dst] = instruction;

    while (quantity > 0) {
      const srcStack = result.get(src);
      const dstStack = result.get(dst);

      if (srcStack && dstStack) {
        const crate = srcStack.pop();

        if (crate) {
          dstStack.push(crate);
        }
      }

      quantity -= 1;
    }

    instruction = instructionQueue.shift();
  }

  return result;
}

function processInstructions2(
  crateStacks: Map<number, string[]>,
  instructionQueue: Instruction[]
): Map<number, string[]> {
  const result = new Map<number, string[]>();

  for (const [key, value] of crateStacks) {
    result.set(key, [...value]);
  }

  let instruction = instructionQueue.shift();

  while (instruction) {
    let [quantity] = instruction;
    const [, src, dst] = instruction;
    const buffer: string[] = [];
    const srcStack = result.get(src);
    const dstStack = result.get(dst);

    if (srcStack && dstStack) {
      while (quantity > 0) {
        const crate = srcStack.pop();

        if (crate) {
          buffer.push(crate);
        }

        quantity -= 1;
      }

      let crate = buffer.pop();

      while (crate) {
        dstStack.push(crate);
        crate = buffer.pop();
      }
    }

    instruction = instructionQueue.shift();
  }

  return result;
}

main(process.argv[2]);
