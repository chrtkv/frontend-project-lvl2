import sortBy from 'lodash/fp/sortBy.js';
import _ from 'lodash';

export default (diff) => {
  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return '[complex value]';
    }
    if (typeof value === 'string') {
      return `'${value}'`;
    }
    return value;
  };
  const iter = (data, path) => {
    const sortedKeys = sortBy(_.identity)(Object.keys(data));
    const formattedLines = sortedKeys.reduce((acc, key) => {
      const { oldValue, newValue, status } = data[key];
      if (!status) {
        return [...acc, `${iter(data[key], `${path}${key}.`)}`];
      }
      const formattedOldValue = formatValue(oldValue);
      const formattedNewValue = formatValue(newValue);
      const commonPart = `Property '${path}${key}' was ${status}`;
      switch (status) {
        case 'updated':
          return [...acc, `${commonPart}. From ${formattedOldValue} to ${formattedNewValue}`];
        case 'removed':
          return [...acc, commonPart];
        case 'added':
          return [...acc, `${commonPart} with value: ${formattedNewValue}`];
        default:
          return acc;
      }
    }, []);

    return formattedLines.join('\n');
  };
  return iter(diff, '');
};
