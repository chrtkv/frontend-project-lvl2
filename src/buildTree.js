import _ from 'lodash';

const buildTree = (data1, data2) => {
  const keys = _.sortBy(_.union(_.keys(data1), _.keys(data2)));
  return keys.map((key) => {
    if (_.isPlainObject(data1[key]) && _.isPlainObject(data2[key])) {
      return {
        key,
        type: 'nested',
        children: buildTree(data1[key], data2[key]),
      };
    }

    if (_.has(data1, key) && !_.has(data2, key)) {
      return { key, type: 'removed', value1: data1[key] };
    }

    if (!_.has(data1, key) && _.has(data2, key)) {
      return { key, type: 'added', value2: data2[key] };
    }

    if (!_.isEqual(data1[key], data2[key])) {
      return {
        key,
        type: 'updated',
        value1: data1[key],
        value2: data2[key],
      };
    }

    return { key, type: 'unchanged', value1: data1[key] };
  });
};

export default buildTree;
