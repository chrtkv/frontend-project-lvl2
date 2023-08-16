import _ from 'lodash';

const format = (data, path = '') => {
  if (_.has(data, 'type')) {
    const {
      children,
      key,
      type,
      value1,
      value2,
    } = data;
    const commonPart = `Property '${path}${key}' was ${type}`;

    switch (type) {
      case 'nested':
        return `${format(children, `${path}${key}.`)}`;
      case 'unchanged':
        return '';
      case 'updated':
        return `${commonPart}. From ${format(value1, path)} to ${format(value2, path)}`;
      case 'removed':
        return commonPart;
      case 'added':
        return `${commonPart} with value: ${format(value2, path)}`;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }

  if (_.isPlainObject(data)) {
    return '[complex value]';
  }

  if (_.isString(data)) {
    return `'${data}'`;
  }

  if (!_.isObject(data)) {
    return data;
  }

  return data
    .map((item) => format(item, path))
    .filter(_.identity)
    .join('\n');
};

export default format;
