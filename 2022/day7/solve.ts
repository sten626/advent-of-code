import { open } from '../../shared';

async function main(inputFile: string) {
  let availableSpace = 70000000;
  const cwd: string[] = [];
  const dirSizes = new Map<string, number>();
  const neededSpace = 30000000;

  for await (const line of open(inputFile)) {
    const parts = line.split(' ');

    if (parts[0] === '$') {
      // Command
      const cmd = parts[1];

      if (cmd === 'cd') {
        const dst = parts[2];

        if (dst === '/') {
          cwd.splice(0, cwd.length);
        } else if (dst === '..') {
          cwd.pop();
        } else {
          cwd.push(dst);
        }
      } else {
        continue;
      }
    } else if (parts[0] === 'dir') {
      continue;
    } else {
      // Should be a number
      const size = Number.parseInt(parts[0]);
      const path = [...cwd];

      while (path.length > 0) {
        const pathString = path.join('/');
        const dirSize = dirSizes.get(pathString) || 0;
        dirSizes.set(pathString, dirSize + size);
        path.pop();
      }

      const dirSize = dirSizes.get('/') || 0;
      dirSizes.set('/', dirSize + size);
      availableSpace -= size;
    }
  }

  let smallDirsSum = 0;
  const spaceToFree = neededSpace - availableSpace;
  let dirToDelete = [Infinity, ''];

  for (const [dir, size] of dirSizes) {
    if (size <= 100000) {
      smallDirsSum += size;
    }
    if (spaceToFree <= size && size < dirToDelete[0]) {
      dirToDelete = [size, dir];
    }
  }

  console.log(`Part 1: Sum is ${smallDirsSum}`);
  console.log(`Part 2: Delete ${dirToDelete[1]} to free up ${dirToDelete[0]}`);
}

main(process.argv[2]);
