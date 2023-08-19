import _ from 'lodash';

const stringify = (data) => {
  if (_.isObject(data)) {
    return '[complex value]';
  }

  if (_.isString(data)) {
    return `'${data}'`;
  }

  return data;
};

const render = (tree, path) => tree
  .flatMap(({
    key,
    type,
    value1,
    value2,
    children,
  }) => {
    const commonPart = `Property '${path}${key}' was ${type}`;
    switch (type) {
      case 'nested':
        return `${render(children, `${path}${key}.`)}`;
      case 'unchanged':
        return '';
      case 'updated':
        return `${commonPart}. From ${stringify(value1)} to ${stringify(value2)}`;
      case 'removed':
        return commonPart;
      case 'added':
        return `${commonPart} with value: ${stringify(value2)}`;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  })
  .filter(_.identity)
  .join('\n');

export default (tree) => render(tree, '');
