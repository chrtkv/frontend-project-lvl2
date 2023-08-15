import formatter from './formatters/index.js';
import parse from './parser.js';
import { buildComparisonTree, extractFormat, readFile } from './utils.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const fileFormat1 = extractFormat(filepath1);
  const fileFormat2 = extractFormat(filepath2);
  const parsedData1 = parse(readFile(filepath1), fileFormat1);
  const parsedData2 = parse(readFile(filepath2), fileFormat2);
  const comparisonTree = buildComparisonTree(parsedData1, parsedData2);

  const formattedDiff = formatter[formatName](comparisonTree);
  return formattedDiff;
};

export default genDiff;
