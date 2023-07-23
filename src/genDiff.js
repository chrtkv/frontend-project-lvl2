import { readFileSync } from 'fs';
import { extname } from 'path';
import parse from './parser.js';
import compare from './comparator.js';
import getFormatter from './formatters/index.js';

const genDiff = (filePath1, filePath2, formatName = 'stylish') => {
  const file1extension = extname(filePath1);
  const file2extension = extname(filePath2);
  const file1data = parse(readFileSync(filePath1, 'utf-8'), file1extension);
  const file2data = parse(readFileSync(filePath2, 'utf-8'), file2extension);
  const comparedData = compare(file1data, file2data);

  const formatter = getFormatter(formatName);
  const formattedDiff = formatter(comparedData);
  return formattedDiff;
};

export default genDiff;
