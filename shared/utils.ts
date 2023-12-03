import { createReadStream } from 'node:fs';
import { createInterface, Interface } from 'node:readline';

export function all(iterable: Iterable<boolean>): boolean {
  for (const element of iterable) {
    if (!element) {
      return false;
    }
  }

  return true;
}

export function any(iterable: Iterable<boolean>): boolean {
  for (const element of iterable) {
    if (element) {
      return true;
    }
  }

  return false;
}

export function* chain<T>(...iterables: Iterable<T>[]): Generator<T> {
  for (const iterable of iterables) {
    for (const element of iterable) {
      yield element;
    }
  }
}

export function* cycle<T>(iterable: Iterable<T>): Generator<T> {
  const saved = [];

  for (const element of iterable) {
    yield element;
    saved.push(element);
  }

  while (saved.length > 0) {
    for (const element of saved) {
      yield element;
    }
  }
}

export function* enumerate<T>(
  iterable: Iterable<T>,
  start = 0,
): Generator<[number, T]> {
  let i = start;

  for (const element of iterable) {
    yield [i, element];
    i += 1;
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

export function range(stop: number): Generator<number>;
export function range(
  start: number,
  stop: number,
  step?: number,
): Generator<number>;
export function* range(
  startOrStop: number,
  stop?: number,
  step?: number,
): Generator<number> {
  let start = 0;

  if (stop === undefined) {
    stop = startOrStop;
  } else {
    start = startOrStop;
  }

  if (step === undefined) {
    step = 1;
  }

  for (let i = start; i < stop; i += step) {
    yield i;
  }
}
