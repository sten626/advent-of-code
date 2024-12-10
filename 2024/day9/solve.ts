import { readFileSync } from 'fs';
import { range } from '../../shared';

interface Block {
  id: number;
  size: number;
}

function checksum(blocks: Block[]): number {
  let checksum = 0;
  let i = 0;

  for (const block of blocks) {
    if (block.id !== -1) {
      for (const j of range(block.size)) {
        checksum += (j + i) * block.id;
      }
    }

    i += block.size;
  }

  return checksum;
}

function movePart1(blocks: Block[]): Block[] {
  let hasEmptyBlocks = true;

  while (hasEmptyBlocks) {
    const blockToMove = blocks.pop() as Block;
    if (blockToMove.id === -1) {
      continue;
    }

    while (blockToMove.size > 0) {
      const emptyBlockIndex = blocks.findIndex((b) => b.id === -1);
      if (emptyBlockIndex === -1) {
        blocks.push(blockToMove);
        hasEmptyBlocks = false;
        break;
      }

      const emptyBlock = blocks[emptyBlockIndex];

      if (blockToMove.size >= emptyBlock.size) {
        // Can just fill/replace
        emptyBlock.id = blockToMove.id;
        blockToMove.size -= emptyBlock.size;
      } else {
        // Have extra space; have to insert a new block
        emptyBlock.size -= blockToMove.size;
        blocks.splice(emptyBlockIndex, 0, blockToMove);
        break;
      }
    }
  }

  return blocks;
}

function movePart2(blocks: Block[]): Block[] {
  const maxId = Math.max(...blocks.map((b) => b.id));

  for (let id = maxId; id >= 0; id--) {
    const blockToMoveIndex = blocks.findIndex((b) => b.id === id);
    const blockToMove = blocks[blockToMoveIndex];
    const emptyBlockIndex = blocks.findIndex(
      (b) => b.id === -1 && b.size >= blockToMove.size,
    );

    if (emptyBlockIndex === -1 || emptyBlockIndex > blockToMoveIndex) {
      // No spaces large enough to the left
      continue;
    }

    const emptyBlock = blocks[emptyBlockIndex];

    if (blockToMove.size === emptyBlock.size) {
      // Just replace it
      blocks.splice(blockToMoveIndex, 1, { id: -1, size: blockToMove.size });
      blocks.splice(emptyBlockIndex, 1, blockToMove);
    } else {
      // Make empty block smaller and put in front of it.
      emptyBlock.size -= blockToMove.size;
      blocks.splice(blockToMoveIndex, 1, { id: -1, size: blockToMove.size });
      blocks.splice(emptyBlockIndex, 0, blockToMove);
    }

    // Check for adjacent empties and merge them
    const newBlocks: Block[] = [];
    let currentEmpty: Block | null = null;

    for (const block of blocks) {
      if (block.id !== -1) {
        if (currentEmpty) {
          newBlocks.push(currentEmpty);
          currentEmpty = null;
        }

        newBlocks.push(block);
        continue;
      }

      if (currentEmpty) {
        currentEmpty.size += block.size;
      } else {
        currentEmpty = block;
      }
    }

    if (currentEmpty) {
      newBlocks.push(currentEmpty);
    }

    blocks = newBlocks;

    // printBlocks(blocks);
  }

  return blocks;
}

function parseBlocks(input: string): Block[] {
  const blocks: Block[] = [];
  let id = 0;
  let file = true;

  for (const num of [...input].map((v) => Number.parseInt(v))) {
    if (file) {
      blocks.push({ id, size: num });
      id += 1;
      file = false;
    } else {
      blocks.push({ id: -1, size: num });
      file = true;
    }
  }

  return blocks;
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  let blocks = parseBlocks(input);

  // console.log(blocks);
  const movedBlocks1 = movePart1(blocks);

  // printBlocks(blocks);

  const part1Checksum = checksum(movedBlocks1);

  console.log(`Part 1: ${part1Checksum}`);

  blocks = parseBlocks(input);
  const movedBlocks2 = movePart2(blocks);
  // printBlocks(movedBlocks2);
  const part2Checksum = checksum(movedBlocks2);

  console.log(`Part 2: ${part2Checksum}`);
}

// function printBlocks(blocks: Block[]) {
//   console.log(
//     blocks
//       .map((b) =>
//         b.id !== -1 ? b.id.toString().repeat(b.size) : '.'.repeat(b.size),
//       )
//       .join(''),
//   );
// }

main(process.argv[2]);
