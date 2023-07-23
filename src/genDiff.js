import { readFileSync } from 'fs';
import { extname } from 'path';
import parser from './parser.js';
import formatters from '../formatters/index.js';

const compareDataChanges = (oldData, newData) => {
  const isObject = (value) => typeof value === 'object' && !Array.isArray(value) && value !== null;

  if (isObject(oldData) && isObject(newData)) {
    const keys = [...new Set([...Object.keys(oldData), ...Object.keys(newData)])];
    return keys.reduce((acc, key) => {
      const result = compareDataChanges(oldData[key], newData[key]);
      return { ...acc, [key]: result };
    }, {});
  }

  const result = {
    oldValue: oldData,
    newValue: newData,
  };

  if (oldData === newData) {
    return { ...result, status: 'unchanged' };
  }

  if (oldData !== undefined && newData === undefined) {
    return { ...result, status: 'removed' };
  }

  if (oldData === undefined && newData !== undefined) {
    return { ...result, status: 'added' };
  }

  return { ...result, status: 'updated' };
};

const genDiff = (filePath1, filePath2, formatName) => {
  const file1extension = extname(filePath1);
  const file2extension = extname(filePath2);
  const file1data = parser(readFileSync(filePath1, 'utf-8'), file1extension);
  const file2data = parser(readFileSync(filePath2, 'utf-8'), file2extension);
  const comparedData = compareDataChanges(file1data, file2data);

  const formatter = formatters[formatName];
  const formattedDiff = formatter(comparedData);
  return formattedDiff;
};

export default genDiff;
