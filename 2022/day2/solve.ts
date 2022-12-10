import { open } from '../shared';

type MatchOutcome = 0 | 3 | 6;

enum Move {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

const moves: Record<string, Move> = {
  A: Move.Rock,
  B: Move.Paper,
  C: Move.Scissors,
  X: Move.Rock,
  Y: Move.Paper,
  Z: Move.Scissors,
};

const desiredOutcomes: Record<string, MatchOutcome> = {
  X: 0,
  Y: 3,
  Z: 6,
};

async function main(inputFile: string) {
  await part1(inputFile);
  await part2(inputFile);
}

function outcome(move: Move, response: Move): MatchOutcome {
  let diff = response - move;

  if (diff < 0) {
    diff += 3;
  }

  if (diff === 0) {
    // Draw
    return 3;
  } else if (diff === 1) {
    // Win
    return 6;
  } else {
    // Loss
    return 0;
  }
}

function parseLine(line: string): [Move, Move] {
  const lineArray = line.split(' ');

  if (lineArray.length !== 2) {
    throw Error(`Line should have 2 values. Saw ${line}.`);
  }

  const move = moves[lineArray[0]];
  const response = moves[lineArray[1]];

  return [move, response];
}

function parseLine2(line: string): [Move, Move] {
  const lineArray = line.split(' ');

  if (lineArray.length !== 2) {
    throw Error(`Line should have 2 values. Saw ${line}.`);
  }

  const move = moves[lineArray[0]];
  const desiredOutcome = desiredOutcomes[lineArray[1]];
  let response: number;

  if (desiredOutcome == 0) {
    response = move + 2;
  } else if (desiredOutcome == 3) {
    response = move;
  } else {
    response = move + 1;
  }

  if (response > 3) {
    response -= 3;
  }

  return [move, response];
}

async function part1(inputFile: string) {
  let score = 0;

  for await (const line of open(inputFile)) {
    const [move, response] = parseLine(line);
    score += response + outcome(move, response);
  }

  console.log(`Your score is ${score}.`);
}

async function part2(inputFile: string) {
  let score = 0;

  for await (const line of open(inputFile)) {
    const [move, response] = parseLine2(line);
    score += response + outcome(move, response);
  }

  console.log(`Your score is ${score}.`);
}

main(process.argv[2]);
