import { open } from '../shared';

function findMarker(buffer: string, size: number): number {
  let start = 0;
  let end = size;

  while (end < buffer.length) {
    const chars = new Set(buffer.substring(start, end));

    if (chars.size === size) {
      return end;
    }

    start += 1;
    end += 1;
  }

  throw Error('No marker found');
}

function findMessageMarker(buffer: string): number {
  return findMarker(buffer, 14);
}

function findPacketMarker(buffer: string): number {
  return findMarker(buffer, 4);
}

async function main(inputFile: string) {
  await part1(inputFile);
  await part2(inputFile);
}

async function parseLine(inputFile: string): Promise<string> {
  for await (const line of open(inputFile)) {
    return line;
  }

  return '';
}

async function part1(inputFile: string) {
  const buffer = await parseLine(inputFile);
  const nProcessed = findPacketMarker(buffer);
  console.log(`Start of packet marker after ${nProcessed} characters`);
}

async function part2(inputFile: string) {
  const buffer = await parseLine(inputFile);
  const nProcessed = findMessageMarker(buffer);
  console.log(`Start of message marker after ${nProcessed} characters`);
}

main('input.txt');
