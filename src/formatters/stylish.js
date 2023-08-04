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

    if (_.isPlainObject(data)) {
      return iter(
        Object.entries(data).map(([key, val]) => ({ key, value1: val, type: 'unchanged' })),
        depth,
      );
    }

    const formattedLines = data.flatMap(({
      key,
      type,
      value1,
      value2,
      children,
    }) => {
      switch (type) {
        case 'nested':
          return `${indent}${key}: ${iter(children, depth + 1)}`;
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
    });

    return [
      '{',
      ...formattedLines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(diff, 1);
};
