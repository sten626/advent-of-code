import { exec } from 'node:child_process';
import path from 'node:path';
import yargs from 'yargs/yargs';

const argv = yargs(process.argv.slice(2))
  .command(
    '* <year> <day> [options]',
    'Run an Advent of Code solution.',
    (yargs) => {
      yargs
        .positional('year', {
          describe: 'The year that the solution is from.',
          type: 'number',
        })
        .positional('day', {
          describe: 'The day that the solution is from.',
          type: 'number',
        })
        .option('s', {
          alias: 'sample',
          default: false,
          describe:
            'If specified, run against sample input instead of the true input file.',
          type: 'boolean',
        });
    }
  )
  .parseSync();

const tsNode = process.argv[0];
const solutionDir = path.resolve(
  __dirname,
  '..',
  `${argv.year}`,
  `day${argv.day}`
);
const inputFile = argv.s ? 'sample.txt' : 'input.txt';

exec(
  `${tsNode} solve.ts ${inputFile}`,
  { cwd: solutionDir },
  (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }

    console.log(stdout);

    if (stderr) {
      console.error(`stderr:\n${stderr}`);
    }
  }
);
