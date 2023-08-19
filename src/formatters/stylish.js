import _ from 'lodash';

const REMOVED_TYPE_SIGN = '-';
const ADDED_TYPE_SIGN = '+';
const OFFSET_FROM_END = 2; // Offset from the end of the indent
const INDENT_CHAR = ' ';
const INDENT_CHARS_COUNT = 4;

const formatIndent = (depth, typeSign = ' ') => {
  const indent = INDENT_CHAR.repeat(depth * INDENT_CHARS_COUNT);
  const replaceTypeSign = (char, index, arr) => (
    (arr.length - OFFSET_FROM_END === index) ? typeSign : char
  );

  return indent.split('').map(replaceTypeSign).join('');
};

const stringify = (data, depth) => {
  if (!_.isObject(data)) {
    return `${data}`;
  }

  const indent = formatIndent(depth);
  const bracketIndent = formatIndent(depth - 1);

  if (_.isPlainObject(data)) {
    const formattedLines = Object.entries(data)
      .map(([key, value]) => `${indent}${key}: ${stringify(value, depth + 1)}`);
    return stringify(formattedLines, depth);
  }

  return [
    '{',
    ...data,
    `${bracketIndent}}`,
  ].join('\n');
};

const render = (tree, depth) => stringify(tree
  .flatMap(({
    key,
    type,
    value1,
    value2,
    children,
  }) => {
    switch (type) {
      case 'nested':
        return `${formatIndent(depth)}${key}: ${render(children, depth + 1)}`;
      case 'unchanged':
        return `${formatIndent(depth)}${key}: ${stringify(value1, depth + 1)}`;
      case 'updated':
        return [
          `${formatIndent(depth, REMOVED_TYPE_SIGN)}${key}: ${stringify(value1, depth + 1)}`,
          `${formatIndent(depth, ADDED_TYPE_SIGN)}${key}: ${stringify(value2, depth + 1)}`,
        ];
      case 'removed':
        return `${formatIndent(depth, REMOVED_TYPE_SIGN)}${key}: ${stringify(value1, depth + 1)}`;
      case 'added':
        return `${formatIndent(depth, ADDED_TYPE_SIGN)}${key}: ${stringify(value2, depth + 1)}`;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }), depth);

export default (tree) => render(tree, 1);
