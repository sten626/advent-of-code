import { open } from '../shared';

type Direction = 'U' | 'R' | 'D' | 'L';
type Instruction = [Direction, number];
type Position = [number, number];

async function main(inputFile: string) {
  const part1Rope = makeRope(2);
  const visitedPart1 = new Set<string>();
  const part2Rope = makeRope(10);
  const visitedPart2 = new Set<string>();

  for await (const inst of parseInstructions(inputFile)) {
    move(part1Rope, visitedPart1, inst);
    move(part2Rope, visitedPart2, inst);
    // print(head, tail);
  }

  console.log(`Part 1: Tail visits ${visitedPart1.size} positions`);
  console.log(`Part 2: Tail visits ${visitedPart2.size} positions`);
}

function makeRope(numKnots: number): Position[] {
  const knots: Position[] = [];

  while (numKnots > 0) {
    knots.push([0, 0]);
    numKnots -= 1;
  }

  return knots;
}

function move(knots: Position[], visited: Set<string>, inst: Instruction) {
  const [dir] = inst;
  let [, length] = inst;
  const head = knots[0];

  while (length > 0) {
    switch (dir) {
      case 'U':
        head[1] += 1;
        break;
      case 'D':
        head[1] -= 1;
        break;
      case 'R':
        head[0] += 1;
        break;
      case 'L':
        head[0] -= 1;
        break;
    }

    // console.log(`Head: ${head}`);

    for (let i = 1; i < knots.length; i++) {
      const prev = knots[i - 1];
      const cur = knots[i];

      if (prev[0] === cur[0]) {
        // Equal on x-axis
        const difference = prev[1] - cur[1];

        if (Math.abs(difference) > 1) {
          cur[1] += Math.sign(difference);
        }
      } else if (prev[1] === cur[1]) {
        // Equal on y-axis
        const difference = prev[0] - cur[0];

        if (Math.abs(difference) > 1) {
          cur[0] += Math.sign(difference);
        }
      } else {
        // Diagonal
        const xDifference = prev[0] - cur[0];
        const yDifference = prev[1] - cur[1];

        if (Math.abs(xDifference) > 1 || Math.abs(yDifference) > 1) {
          const x = Math.sign(prev[0] - cur[0]);
          const y = Math.sign(prev[1] - cur[1]);
          cur[0] += x;
          cur[1] += y;
        }
      }
    }

    visited.add(knots[knots.length - 1].join('-'));
    length -= 1;
  }
}

async function* parseInstructions(
  inputFile: string
): AsyncGenerator<Instruction> {
  for await (const line of open(inputFile)) {
    const [dirString, length] = line.split(' ');
    yield [dirString as Direction, Number.parseInt(length)];
  }
}

// function print(head: Position, tail: Position) {
//   console.log();
//   for (let y = 4; y >= 0; y--) {
//     let line = '';

//     for (let x = 0; x < 6; x++) {
//       if (head[0] === x && head[1] === y) {
//         line += 'H';
//       } else if (tail[0] === x && tail[1] === y) {
//         line += 'T';
//       } else {
//         line += '.';
//       }
//     }

//     console.log(line);
//   }
//   console.log();
// }

main('input.txt');
