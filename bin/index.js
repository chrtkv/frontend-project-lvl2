#!/usr/bin/env node

const package = require('../package.json');

const { Command } = require('commander');
const program = new Command();
program
  .version(package.version)
  .description(package.description)
  .helpOption('-h, --help', 'output usage information');

program.parse(process.argv);