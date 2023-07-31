import _ from 'lodash';

export default (diff) => {
  const formatValue = (value) => {
    if (_.isPlainObject(value)) {
      return '[complex value]';
    }
    if (_.isString(value)) {
      return `'${value}'`;
    }
    return value;
  };

  const iter = (data, path) => {
    const sortedKeys = _.sortBy(_.keys(data));
    const formattedLines = sortedKeys.reduce((acc, key) => {
      const { oldValue, newValue, status } = data[key];
      if (!status) {
        return [...acc, `${iter(data[key], `${path}${key}.`)}`];
      }
      const formattedOldValue = formatValue(oldValue);
      const formattedNewValue = formatValue(newValue);
      const commonPart = `Property '${path}${key}' was ${status}`;
      switch (status) {
        case 'unchanged':
          return acc;
        case 'updated':
          return [...acc, `${commonPart}. From ${formattedOldValue} to ${formattedNewValue}`];
        case 'removed':
          return [...acc, commonPart];
        case 'added':
          return [...acc, `${commonPart} with value: ${formattedNewValue}`];
        default:
          throw new Error(`Unknown status: ${status}`);
      }
    }, []);

    return formattedLines.join('\n');
  };
  return iter(diff, '');
};
