import sortBy from 'lodash/fp/sortBy.js';
import _ from 'lodash';

export default (diff, indentChar = ' ', indentCharsCount = 4) => {
  const formatIndent = (indent, symbol) => {
    const cb = (char, index, arr) => ((arr.length - 2 === index) ? symbol : char);
    return indent.split('').map(cb).join('');
  };
  const iter = (data, depth) => {
    if (typeof data !== 'object') {
      return data.toString();
    }
    if (data === null) {
      return 'null';
    }
    const indent = indentChar.repeat(depth * indentCharsCount);
    const bracketIndent = indentChar.repeat((depth * indentCharsCount) - indentCharsCount);
    const sortedKeys = sortBy(_.identity)(Object.keys(data));
    const formattedLines = sortedKeys.reduce((acc, key) => {
      const { oldValue, newValue, status } = data[key];
      switch (status) {
        case 'unchanged':
          return [
            ...acc,
            `${indent}${key}: ${oldValue}`,
          ];
        case 'updated':
          return [
            ...acc,
            `${formatIndent(indent, '-')}${key}: ${iter(oldValue, depth + 1)}`,
            `${formatIndent(indent, '+')}${key}: ${iter(newValue, depth + 1)}`,
          ];
        case 'removed':
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