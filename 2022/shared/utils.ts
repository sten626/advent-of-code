import { createReadStream } from 'node:fs';
import { createInterface, Interface } from 'node:readline';

export function open(path: string): Interface {
  const fileStream = createReadStream(path);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return rl;
}
