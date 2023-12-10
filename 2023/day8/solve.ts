import { readFileSync } from 'fs';
import { lcm } from '../../shared';

const instructionRegex = /^[LR]+$/;
const nodeRegex = /(\w+) = \((\w+), (\w+)\)/;

class Node {
  private _isEndNode = false;
  private _isStartNode = false;
  private _name: string;
  private _left: string;
  private _right: string;

  constructor(nodeMatch: RegExpMatchArray) {
    this._name = nodeMatch[1];
    this._left = nodeMatch[2];
    this._right = nodeMatch[3];

    if (this._name.endsWith('A')) {
      this._isStartNode = true;
    } else if (this._name.endsWith('Z')) {
      this._isEndNode = true;
    }
  }

  get isEndNode(): boolean {
    return this._isEndNode;
  }

  get isStartNode(): boolean {
    return this._isStartNode;
  }

  get left(): string {
    return this._left;
  }

  get name(): string {
    return this._name;
  }

  get right(): string {
    return this._right;
  }
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  let instructions = '';
  const nodes = new Map<string, Node>();

  for (const line of input.split('\n')) {
    if (line === '') {
      continue;
    }

    const instructionMatch = line.match(instructionRegex);
    if (instructionMatch) {
      instructions = instructionMatch[0];
      continue;
    }

    const nodeMatch = line.match(nodeRegex);
    if (nodeMatch) {
      const node = new Node(nodeMatch);
      nodes.set(node.name, node);
      continue;
    }

    throw new Error(`Unexpected line: ${line}`);
  }

  part1(instructions, nodes);
  part2(instructions, nodes);
}

function part1(instructions: string, nodes: Map<string, Node>) {
  let current = nodes.get('AAA');
  if (current === undefined) {
    throw new Error(`Couldn't find node AAA`);
  }

  let steps = 0;

  while (current.name !== 'ZZZ') {
    for (const instruction of instructions) {
      steps += 1;

      switch (instruction) {
        case 'L': {
          const left = current.left;
          current = nodes.get(left);
          if (current === undefined) {
            throw new Error(`Couldn't find node ${left}`);
          }
          break;
        }
        case 'R': {
          const right = current.right;
          current = nodes.get(right);
          if (current === undefined) {
            throw new Error(`Couldn't find node ${right}`);
          }
          break;
        }
        default: {
          throw new Error(`Unknown instruction ${instruction}`);
        }
      }

      if (current.name === 'ZZZ') {
        break;
      }
    }
  }

  console.log(steps);
}

function part2(instructions: string, nodes: Map<string, Node>) {
  const startNodes = Array.from(nodes.values()).filter((n) => n.isStartNode);
  const numSteps = new Map<string, number>();

  for (const startNode of startNodes) {
    let current = startNode;

    while (!current.isEndNode) {
      for (const instruction of instructions) {
        let nextName: string | null = null;

        switch (instruction) {
          case 'L': {
            nextName = current.left;
            break;
          }
          case 'R': {
            nextName = current.right;
            break;
          }
          default: {
            throw new Error(`Invalid instruction ${instruction}`);
          }
        }

        const next = nodes.get(nextName);
        if (next === undefined) {
          throw new Error(`Node ${nextName} not found.`);
        }

        current = next;
        const nodeSteps = numSteps.get(startNode.name) || 0;
        numSteps.set(startNode.name, nodeSteps + 1);

        if (current.isEndNode) {
          break;
        }
      }
    }
  }

  console.log(lcm(...numSteps.values()));
}

main(process.argv[2]);
