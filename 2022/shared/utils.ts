import { createReadStream } from 'node:fs';
import { createInterface, Interface } from 'node:readline';

export function* chain<T>(...iterables: Iterable<T>[]): Generator<T> {
  for (const iterable of iterables) {
    for (const element of iterable) {
      yield element;
    }
  }
}

export function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const common = new Set<T>();

  for (const elem of setA) {
    if (setB.has(elem)) {
      common.add(elem);
    }
  }

  return common;
}

export function isSuperset<T>(set: Set<T>, subset: Set<T>): boolean {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }

  return true;
}

export function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const unionSet = new Set<T>(setA);

  for (const elem of setB) {
    unionSet.add(elem);
  }

  return unionSet;
}

export function open(path: string): Interface {
  const fileStream = createReadStream(path);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return rl;
}
