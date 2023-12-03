import { readFileSync } from 'node:fs';
import { chain } from '../../shared';

type NestedArray = Array<number | NestedArray>;
type Packet = NestedArray | number;
type Pair = [Packet, Packet];

function compare(a: Packet, b: Packet): number {
  if (Number.isInteger(a)) {
    a = a as number;

    if (Number.isInteger(b)) {
      // Both ints
      b = b as number;
      return a - b;
    } else {
      // a int, b array
      return compare([a], b);
    }
  } else {
    a = a as NestedArray;

    if (Number.isInteger(b)) {
      // a list, b int
      return compare(a, [b]);
    } else {
      // Both lists
      b = b as NestedArray;

      for (const [i, a2] of a.entries()) {
        const b2 = b[i];

        if (b2 === undefined) {
          return 1;
        }

        const check = compare(a2, b2);

        if (check !== 0) {
          return check;
        }
      }

      if (a.length === b.length) {
        return 0;
      }

      return -1;
    }
  }
}

function main(inputFile: string) {
  const packetPairs = parsePacketPairs(inputFile);
  const correctPairs: number[] = [];

  for (const [i, pair] of packetPairs.entries()) {
    const [a, b] = pair;
    const correct = compare(a, b);

    if (correct < 0) {
      correctPairs.push(i + 1);
    }
  }

  const sum = correctPairs.reduce((a, b) => a + b);
  console.log(`Part 1: The sum of indices is ${sum}`);

  const dividerPackets: Packet[] = [[[2]], [[6]]];
  const allPackets = [...chain<Packet>(...packetPairs, dividerPackets)].sort(
    compare,
  );
  const first =
    allPackets.findIndex((p) => p.toString() == [[2]].toString()) + 1;
  const second =
    allPackets.findIndex((p) => p.toString() == [[6]].toString()) + 1;
  const decoder = first * second;
  console.log(`Part 2: Decoder key is ${decoder}`);
}

function parsePacketPairs(inputFile: string): Pair[] {
  return readFileSync(inputFile, {
    encoding: 'utf-8',
  })
    .split('\n\n')
    .map((pairString) =>
      pairString
        .trim()
        .split('\n')
        .map((packet) => eval(packet)),
    ) as Pair[];
}

main(process.argv[2]);
