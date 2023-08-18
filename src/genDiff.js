import fs from 'node:fs';
import path from 'node:path';

import format from './formatters/index.js';
import parse from './parser.js';
import buildTree from './buildTree.js';

const readFile = (filepath) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  return fs.readFileSync(fullPath, 'utf-8');
};

const extractFileFormat = (filepath) => {
  const extension = path.extname(filepath);
  return extension.slice(1);
};

const getData = (filepath) => {
  const fileFormat = extractFileFormat(filepath);
  const data = readFile(filepath);
  return parse(data, fileFormat);
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);
  const tree = buildTree(data1, data2);

  return format(tree, formatName);
};

export default genDiff;
