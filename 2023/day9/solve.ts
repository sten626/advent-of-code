import { readFileSync } from 'fs';
import { all, range } from '../../shared';

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  const sequences = input
    .split('\n')
    .map((l) => l.split(' ').map((n) => Number.parseInt(n)));

  const extrapolated = sequences.map((s) => extrapolateForward(s));
  const sum = extrapolated.map((s) => s[s.length - 1]).reduce((a, b) => a + b);
  console.log(sum);

  const extrapolatedBackwards = sequences.map((s) => extrapolateBackward(s));
  const frontSum = extrapolatedBackwards
    .map((s) => s[0])
    .reduce((a, b) => a + b);
  console.log(frontSum);
}

const extrapolateForwardMemo = new Map<string, number[]>();

function extrapolateForward(sequence: number[]): number[] {
  const key = sequence.join('-');
  let result = extrapolateForwardMemo.get(key);
  if (result !== undefined) {
    return result;
  }

  if (all(sequence.map((n) => n === 0))) {
    return [...sequence, 0];
  }

  const reduced = [];
  const seqLength = sequence.length;

  for (const i of range(seqLength - 1)) {
    reduced.push(sequence[i + 1] - sequence[i]);
  }

  const extrapolated = extrapolateForward(reduced);
  result = [...sequence, sequence[seqLength - 1] + extrapolated[seqLength - 1]];
  extrapolateForwardMemo.set(key, result);

  return result;
}

const extrapolateBackwardMemo = new Map<string, number[]>();

function extrapolateBackward(sequence: number[]): number[] {
  const key = sequence.join('-');
  let result = extrapolateBackwardMemo.get(key);
  if (result !== undefined) {
    return result;
  }

  if (all(sequence.map((n) => n === 0))) {
    return [...sequence, 0];
  }

  const reduced = [];
  const seqLength = sequence.length;

  for (const i of range(seqLength - 1)) {
    reduced.push(sequence[i + 1] - sequence[i]);
  }

  const extrapolated = extrapolateBackward(reduced);
  result = [sequence[0] - extrapolated[0], ...sequence];
  extrapolateBackwardMemo.set(key, result);

  return result;
}

main(process.argv[2]);
