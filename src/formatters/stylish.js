import _ from 'lodash';

export default (diff, indentChar = ' ', indentCharsCount = 4) => {
  const formatIndent = (indent, statusSign) => {
    const cb = (char, index, arr) => ((arr.length - 2 === index) ? statusSign : char);
    return indent.split('').map(cb).join('');
  };

  const iter = (data, depth) => {
    if (_.isNull(data)) {
      return 'null';
    }
    if (!_.isPlainObject(data)) {
      return data.toString();
    }
    const indent = indentChar.repeat(depth * indentCharsCount);
    const bracketIndent = indentChar.repeat((depth * indentCharsCount) - indentCharsCount);
    const sortedKeys = _.sortBy(_.keys(data));
    const formattedLines = sortedKeys.reduce((acc, key) => {
      const { oldValue, newValue, status } = data[key];
      if (!status) {
        return [...acc, `${indent}${key}: ${iter(data[key], depth + 1)}`];
      }
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
          throw new Error(`Unknown status: ${status}`);
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
