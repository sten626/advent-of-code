import { createReadStream } from 'node:fs';
import { createInterface, Interface } from 'node:readline';

export function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const common = new Set<T>();

  for (const elem of setA) {
    if (setB.has(elem)) {
      common.add(elem);
    }
  }

  return common;
}

export function open(path: string): Interface {
  const fileStream = createReadStream(path);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return rl;
}
