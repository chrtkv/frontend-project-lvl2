import _ from 'lodash';

export default (diff, indentChar = ' ', indentCharsCount = 4) => {
  const formatIndent = (indent, statusSign) => {
    const cb = (char, index, arr) => ((arr.length - 2 === index) ? statusSign : char);
    return indent.split('').map(cb).join('');
  };

  const formatValue = (value, depth) => {
    if (!_.isObject(value)) {
      return `${value}`;
    }

    const indent = indentChar.repeat(depth * indentCharsCount);
    const bracketIndent = indentChar.repeat((depth - 1) * indentCharsCount);
    const formattedLines = Object.entries(value)
      .map(([key, val]) => `${indent}${key}: ${formatValue(val, depth + 1)}`);

    return [
      '{',
      ...formattedLines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  const iter = (data, depth) => {
    const indent = indentChar.repeat(depth * indentCharsCount);
    const bracketIndent = indentChar.repeat((depth - 1) * indentCharsCount);

    const formattedLines = data.flatMap(({ value1, value2, key, type, children }) => {
      switch (type) {
        case 'nested':
          return `${indent}${key}: ${iter(children, depth + 1)}`;
        case 'unchanged':
          return `${indent}${key}: ${formatValue(value1, depth + 1)}`;
        case 'updated':
          return [
            `${formatIndent(indent, '-')}${key}: ${formatValue(value1, depth + 1)}`,
            `${formatIndent(indent, '+')}${key}: ${formatValue(value2, depth + 1)}`,
          ];
        case 'removed':
          return `${formatIndent(indent, '-')}${key}: ${formatValue(value1, depth + 1)}`;
        case 'added':
          return `${formatIndent(indent, '+')}${key}: ${formatValue(value2, depth + 1)}`;
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    });

    return ['{', ...formattedLines, `${bracketIndent}}`].join('\n');
  };

  return iter(diff, 1);
};
