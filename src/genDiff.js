import { readFileSync } from 'fs';
import { extname } from 'path';
import parse from './parser.js';
import compare from './comparator.js';
import getFormatter from './formatters/index.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const extension1 = extname(filepath1);
  const extension2 = extname(filepath2);
  const data1 = parse(readFileSync(filepath1, 'utf-8'), extension1);
  const data2 = parse(readFileSync(filepath2, 'utf-8'), extension2);
  const comparedData = compare(data1, data2);

  const formatter = getFormatter(formatName);
  const formattedDiff = formatter(comparedData);
  return formattedDiff;
};

export default genDiff;
