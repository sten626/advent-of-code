import { readFileSync } from 'fs';

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  part1(input);
  part2(input);
}

function part1(input: string) {
  const totalCubes = new Map([
    ['red', 12],
    ['green', 13],
    ['blue', 14],
  ]);

  let idSum = 0;

  for (const line of input.split('\n')) {
    const [gameString, cubesString] = line.split(': ');
    const gameId = Number.parseInt(gameString.split(' ')[1]);

    if (Number.isNaN(gameId)) {
      throw new Error(`Failed to parse game ID for line: ${line}`);
    }

    let isGamePossible = true;

    for (const cubePull of cubesString.split('; ')) {
      for (const cubesOfColour of cubePull.split(', ')) {
        const [numCubesString, cubeColour] = cubesOfColour.split(' ');
        const numCubes = Number.parseInt(numCubesString);

        if (Number.isNaN(numCubes)) {
          throw new Error(`Failed to parse num cubes for line: ${line}`);
        }

        if ((totalCubes.get(cubeColour) || 0) < numCubes) {
          isGamePossible = false;
          break;
        }
      }

      if (!isGamePossible) {
        break;
      }
    }

    if (isGamePossible) {
      idSum += gameId;
    }
  }

  console.log(idSum);
}

function part2(input: string) {
  let powerSum = 0;

  for (const line of input.split('\n')) {
    const minCubes = new Map<string, number>();
    const [gameString, cubesString] = line.split(': ');
    const gameId = Number.parseInt(gameString.split(' ')[1]);

    if (Number.isNaN(gameId)) {
      throw new Error(`Failed to parse game ID for line: ${line}`);
    }

    for (const cubePull of cubesString.split('; ')) {
      for (const cubesOfColour of cubePull.split(', ')) {
        const [numCubesString, cubeColour] = cubesOfColour.split(' ');
        const numCubes = Number.parseInt(numCubesString);

        if (Number.isNaN(numCubes)) {
          throw new Error(`Failed to parse num cubes for line: ${line}`);
        }

        const curMin = minCubes.get(cubeColour) || 0;

        if (numCubes > curMin) {
          minCubes.set(cubeColour, numCubes);
        }
      }
    }

    const power = Array.from(minCubes.values()).reduce(
      (prev, cur) => prev * cur,
    );
    powerSum += power;
  }

  console.log(powerSum);
}

main(process.argv[2]);
