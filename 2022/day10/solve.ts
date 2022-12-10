import { open } from '../shared';

type Command = 'addx' | 'noop';

class Instruction {
  constructor(public command: Command, public value?: number) {}
}

async function main(inputFile: string) {
  const instructions = parseInstructions(inputFile);
  const crt: string[][] = [];
  let crtRow: string[] = [];
  let instruction: Instruction | null = null;
  let cyclesToCompleteInst = 0;
  let signalStrengthSum = 0;
  let totalCycles = 0;
  let x = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    totalCycles += 1;

    if (totalCycles % 40 === 20) {
      const signalStrength = totalCycles * x;
      signalStrengthSum += signalStrength;
      console.log(
        `During cycle ${totalCycles} X is ${x} for a signal strength ${signalStrength}`
      );
    }

    const pixel = (totalCycles - 1) % 40;

    if (x - 1 <= pixel && pixel <= x + 1) {
      crtRow.push('#');
    } else {
      crtRow.push('.');
    }

    if (pixel === 39) {
      crt.push(crtRow);
      crtRow = [];
    }

    if (!instruction) {
      const result = await instructions.next();

      if (result.done) {
        break;
      }

      instruction = result.value;

      switch (instruction.command) {
        case 'noop':
          cyclesToCompleteInst = 1;
          break;
        case 'addx':
          cyclesToCompleteInst = 2;
          break;
      }
    }

    cyclesToCompleteInst -= 1;

    if (cyclesToCompleteInst < 1) {
      if (instruction.command === 'addx') {
        x += instruction.value || 0;
      }

      instruction = null;
    }
  }

  console.log(`Part 1: Signal strength sum is ${signalStrengthSum}`);
  console.log('Part 2:');

  for (const row of crt) {
    console.log(row.join());
  }
}

async function* parseInstructions(
  inputFile: string
): AsyncGenerator<Instruction> {
  for await (const line of open(inputFile)) {
    if (line.includes(' ')) {
      const split = line.split(' ');
      const value = Number.parseInt(split[1]);
      yield new Instruction(split[0] as Command, value);
    } else {
      yield new Instruction(line as Command);
    }
  }
}

main(process.argv[2]);
