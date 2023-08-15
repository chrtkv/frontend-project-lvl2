#!/usr/bin/env node
import { program } from 'commander';

import genDiff from '../src/genDiff.js';

program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format')
  .action((filepath1, filepath2) => {
    const { format: formatName } = program.opts();
    const diff = genDiff(filepath1, filepath2, formatName);
    console.log(diff);
  });

program.parse();
