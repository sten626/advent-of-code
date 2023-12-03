import { open } from '../../shared';

async function main(inputFile: string) {
  const rows = [];

  for await (const line of open(inputFile)) {
    const rowHeights = [...line].map((h) => Number.parseInt(h));
    rows.push(rowHeights);
  }

  let nVisible = 0;
  let maxScenicScore = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    for (let j = 0; j < row.length; j++) {
      const height = row[j];

      // Left
      let visibleLeft = true;
      let leftScore = 0;
      for (let k = j - 1; k >= 0; k--) {
        leftScore += 1;
        if (row[k] >= height) {
          visibleLeft = false;
          break;
        }
      }

      // Right
      let visibleRight = true;
      let rightScore = 0;
      for (let k = j + 1; k < row.length; k++) {
        rightScore += 1;
        if (row[k] >= height) {
          visibleRight = false;
          break;
        }
      }

      // Up
      let visibleUp = true;
      let upScore = 0;
      for (let k = i - 1; k >= 0; k--) {
        upScore += 1;
        if (rows[k][j] >= height) {
          visibleUp = false;
          break;
        }
      }

      // Down
      let visibleDown = true;
      let downScore = 0;
      for (let k = i + 1; k < rows.length; k++) {
        downScore += 1;
        if (rows[k][j] >= height) {
          visibleDown = false;
          break;
        }
      }

      if (visibleLeft || visibleRight || visibleUp || visibleDown) {
        nVisible += 1;
      }

      const scenicScore = leftScore * rightScore * upScore * downScore;
      maxScenicScore = Math.max(maxScenicScore, scenicScore);
    }
  }

  console.log(`Part 1: There are ${nVisible} visible trees`);
  console.log(`Part 2: Maximum scenic score is ${maxScenicScore}`);
}

main(process.argv[2]);
