import { readFileSync } from 'fs';
import { extname } from 'path';
import parser from './parser.js';

const compareDataChanges = (oldData, newData) => {
  const isObject = (value) => typeof value === 'object' && !Array.isArray(value) && value !== null;
  if (isObject(oldData) && isObject(newData)) {
    const keys = [...new Set([...Object.keys(oldData), ...Object.keys(newData)])];
    return keys.reduce((acc, key) => {
      const result = compareDataChanges(oldData[key], newData[key]);
      return { ...acc, [key]: result };
    }, {});
  }

  if (oldData === newData) {
    return { oldValue: oldData, newValue: newData, status: 'unchanged' };
  }

  if (oldData !== undefined && newData === undefined) {
    return { oldValue: oldData, newValue: newData, status: 'deleted' };
  }

  if (oldData === undefined && newData !== undefined) {
    return { oldValue: oldData, newValue: newData, status: 'added' };
  }

  return { oldValue: oldData, newValue: newData, status: 'changed' };
};

const formatIndent = (indent, symbol) => {
  const cb = (char, index, arr) => ((arr.length - 2 === index) ? symbol : char);
  return indent.split('').map(cb).join('');
};

const formatOutput = (diff, indentChar = ' ', indentCharsCount = 4) => {
  const iter = (data, depth) => {
    if (typeof data !== 'object') {
      return data.toString();
    }
    if (data === null) {
      return 'null';
    }
    const indent = indentChar.repeat(depth * indentCharsCount);
    const bracketIndent = indentChar.repeat((depth * indentCharsCount) - indentCharsCount);
    const sortedKeys = Object.keys(data).sort();
    const formattedLines = sortedKeys.reduce((acc, key) => {
      const { oldValue, newValue, status } = data[key];
      switch (status) {
        case 'unchanged':
          return [
            ...acc,
            `${indent}${key}: ${oldValue}`,
          ];
        case 'changed':
          return [
            ...acc,
            `${formatIndent(indent, '-')}${key}: ${iter(oldValue, depth + 1)}`,
            `${formatIndent(indent, '+')}${key}: ${iter(newValue, depth + 1)}`,
          ];
        case 'deleted':
          return [
            ...acc,
            `${formatIndent(indent, '-')}${key}: ${iter(oldValue, depth + 1)}`,
          ];
        case 'added':
          return [
            ...acc,
            `${formatIndent(indent, '+')}${key}: ${iter(newValue, depth + 1)}`,
          ];
        default:
          return [...acc, `${indent}${key}: ${iter(data[key], depth + 1)}`];
      }
    }, []);

    return [
      '{',
      ...formattedLines,
      `${bracketIndent}}`,
    ].join('\n');
  };
  return iter(diff, 1);
};

const genDiff = (filePath1, filePath2) => {
  const file1extension = extname(filePath1);
  const file2extension = extname(filePath2);
  const file1data = parser(readFileSync(filePath1, 'utf-8'), file1extension);
  const file2data = parser(readFileSync(filePath2, 'utf-8'), file2extension);
  const comparedData = compareDataChanges(file1data, file2data);
  // return JSON.stringify(comparedData);
  return formatOutput(comparedData);
};

export default genDiff;
