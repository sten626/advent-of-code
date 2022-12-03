import path from 'node:path';
import yargs from 'yargs/yargs';

const argv = yargs(process.argv.slice(2))
  .command('* <year> <day>', 'Run an Advent of Code solution.', (yargs) => {
    yargs
      .positional('year', {
        describe: 'The year that the solution is from.',
        type: 'number',
      })
      .positional('day', {
        describe: 'The day that the solution is from.',
        type: 'number',
      });
  })
  .parseSync();

const file = path.resolve(
  __dirname,
  '..',
  `${argv.year}`,
  `day${argv.day}`,
  'solve.ts'
);

require(file);
