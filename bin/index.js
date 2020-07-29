#!/usr/bin/env node

const package = require('../package.json');

const { Command } = require('commander');
const program = new Command();
program
  .version(package.version)
  .description(package.description)
  .arguments('<filepath1> <filepath2>')
  .helpOption('-h, --help', 'output usage information')
  .option('-f, --format [type]',  'output format');

program.parse(process.argv);