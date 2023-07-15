import { readFileSync } from 'fs';
import { extname, parse } from 'path';
import parser from './parser';

// TODO: split to modules
const compareDataChanges = (oldData, newData) => {
  const keys = [...new Set([...Object.keys(oldData), ...Object.keys(newData)])];

  return keys.reduce((acc, key) => { // eslint-disable-line array-callback-return, consistent-return
    if (oldData[key] === newData[key]) {
      return {
        ...acc,
        [key]: {
          oldValue: oldData[key],
          newValue: newData[key],
          status: 'unchanged',
        },
      };
    }
    if (
      Object.keys(oldData).includes(key)
      && !Object.keys(newData).includes(key)
    ) {
      return {
        ...acc,
        [key]: {
          oldValue: oldData[key],
          newValue: null,
          status: 'deleted',
        },
      };
    }
    if (
      !Object.keys(oldData).includes(key)
      && Object.keys(newData).includes(key)
    ) {
      return {
        ...acc,
        [key]: {
          oldValue: null,
          newValue: newData[key],
          status: 'added',
        },
      };
    }
    if (oldData[key] !== newData[key]) {
      return {
        ...acc,
        [key]: {
          oldValue: oldData[key],
          newValue: newData[key],
          status: 'changed',
        },
      };
    }
  }, {});
};

const formatOutput = (data) => {
  const sortedKeys = Object.keys(data).sort();
  const formattedLines = sortedKeys.reduce((acc, key) => {
    const { status, oldValue, newValue } = data[key];
    switch (status) {
      case 'unchanged':
        return [
          ...acc,
          `    ${key}: ${oldValue}`,
        ];
      case 'changed':
        return [
          ...acc,
          `  - ${key}: ${oldValue}`,
          `  + ${key}: ${newValue}`,
        ];
      case 'deleted':
        return [
          ...acc,
          `  - ${key}: ${oldValue}`,
        ];
      case 'added':
        return [
          ...acc,
          `  + ${key}: ${newValue}`,
        ];
      default:
        throw new Error(`Invalid status: ${status}`);
    }
  }, []);
  return `{\n${formattedLines.join('\n')}\n}`;
};

const genDiff = (filePath1, filePath2) => {
  const file1extension = extname(filePath1);
  const file2extension = extname(filePath2);
  const file1data = parser(readFileSync(filePath1, 'utf-8'), file1extension);
  const file2data = parser(readFileSync(filePath2, 'utf-8'), file2extension);
  const comparedData = compareDataChanges(file1data, file2data);
  return formatOutput(comparedData);
};

export default genDiff;
