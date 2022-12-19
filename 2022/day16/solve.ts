import { readFileSync } from 'fs';
import { range } from '../shared';

interface Valve {
  name: string;
  flow: number;
  tunnels: string[];
}

function main(inputFile: string) {
  const data = readFileSync(inputFile, { encoding: 'utf-8' });
  const valveRegex =
    /Valve (\w{2}) has flow rate=(\d+); tunnels* leads* to valves* (((\w{2})(, )*)+)/;
  const valves: Valve[] = [];

  for (const line of data.trim().split('\n')) {
    const match = line.match(valveRegex);

    if (!match) {
      throw Error(`Line failed to parse. ${line}`);
    }

    const valve: Valve = {
      name: match[1],
      flow: Number.parseInt(match[2]),
      tunnels: match[3].split(', '),
    };
    valves.push(valve);
  }

  valves.sort((a, b) => b.flow - a.flow);
  const nameToIndexMap = new Map(valves.map((v, i) => [v.name, i]));
  const nUsefulValves = valves.filter((v) => v.flow > 0).length;
  const nValves = valves.length;
  const adjacentMap = new Map<number, number[]>();
  const flow = new Map<number, number>();

  for (const [i, valve] of valves.entries()) {
    flow.set(i, valve.flow);
    const adjacent = valve.tunnels.map(
      (tunnelName) => nameToIndexMap.get(tunnelName) as number
    );
    adjacentMap.set(i, adjacent);
  }

  const openBitset = 1 << nUsefulValves;
  const opt: number[][][] = [];

  for (let i = 0; i < 30; i++) {
    const iArray: number[][] = [];

    for (let j = 0; j < nValves; j++) {
      iArray.push(new Array(openBitset).fill(0));
    }

    opt.push(iArray);
  }

  for (const time of range(1, 30)) {
    for (const valveIndex of range(nValves)) {
      const valveBit = 1 << valveIndex;

      for (const bitsetCombination of range(openBitset)) {
        let pressure = opt[time][valveIndex][bitsetCombination];

        if ((valveBit & bitsetCombination) !== 0 && time >= 2) {
          pressure = Math.max(
            pressure,
            opt[time - 1][valveIndex][bitsetCombination - valveBit] +
              (flow.get(valveIndex) as number) * time
          );
        }

        for (const adjacentIndex of adjacentMap.get(valveIndex) as number[]) {
          pressure = Math.max(
            pressure,
            opt[time - 1][adjacentIndex][bitsetCombination]
          );
        }

        opt[time][valveIndex][bitsetCombination] = pressure;
      }
    }
  }

  // Part 1

  const aaIndex = nameToIndexMap.get('AA') as number;
  const maxPressure = opt[29][aaIndex][openBitset - 1];
  console.log(`Part 1: Can release ${maxPressure} in 30 minutes`);

  // Part 2

  let best = 0;

  for (const personBits of range(openBitset / 2)) {
    const elephantBits = openBitset - 1 - personBits;
    best = Math.max(
      best,
      opt[25][aaIndex][personBits] + opt[25][aaIndex][elephantBits]
    );
  }

  console.log(`Part 2: Can release ${best} in 26 minutes`);
}

main(process.argv[2]);
