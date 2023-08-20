import fs from 'node:fs';
import path from 'node:path';

import format from './formatters/index.js';
import parse from './parser.js';
import buildTree from './buildTree.js';

const getData = (filepath) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  const fileFormat = path.extname(fullPath).slice(1);
  const data = fs.readFileSync(fullPath, 'utf-8');

  return parse(data, fileFormat);
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);
  const tree = buildTree(data1, data2);

  return format(tree, formatName);
};

export default genDiff;
