import _ from 'lodash';

export default (diff, indentChar = ' ', indentCharsCount = 4) => {
  const formatIndent = (indent, statusSign) => {
    const cb = (char, index, arr) => ((arr.length - 2 === index) ? statusSign : char);
    return indent.split('').map(cb).join('');
  };

  const iter = (data, depth) => {
    const indent = indentChar.repeat(depth * indentCharsCount);
    const bracketIndent = indentChar.repeat((depth - 1) * indentCharsCount);

    if (!_.isObject(data)) {
      return `${data}`;
    }

    if (_.has(data, 'children')) {
      return `${indent}${data.key}: ${iter(data.children, depth + 1)}`;
    }

    if (_.has(data, 'type')) {
      const {
        type,
        key,
        value1,
        value2,
      } = data;
      switch (type) {
        case 'unchanged':
          return `${indent}${key}: ${iter(value1, depth + 1)}`;
        case 'updated':
          return [
            `${formatIndent(indent, '-')}${key}: ${iter(value1, depth + 1)}`,
            `${formatIndent(indent, '+')}${key}: ${iter(value2, depth + 1)}`,
          ];
        case 'removed':
          return `${formatIndent(indent, '-')}${key}: ${iter(value1, depth + 1)}`;
        case 'added':
          return `${formatIndent(indent, '+')}${key}: ${iter(value2, depth + 1)}`;
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    }

    if (_.isPlainObject(data)) {
      const formattedLines = Object.entries(data)
        .map(([key, value]) => `${indent}${key}: ${iter(value, depth + 1)}`);
      return iter(formattedLines, depth);
    }

    const formattedLines = data.flatMap((item) => iter(item, depth));
    return [
      '{',
      ...formattedLines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(diff, 1);
};
