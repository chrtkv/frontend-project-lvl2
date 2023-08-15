import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const readFile = (filepath) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  return fs.readFileSync(fullPath, 'utf-8');
};

const extractFormat = (filepath) => {
  const extension = path.extname(filepath);
  return extension.slice(1);
};

const buildComparisonTree = (data1, data2, key = null) => {
  if (_.isPlainObject(data1) && _.isPlainObject(data2)) {
    const keys = _.sortBy(_.union(_.keys(data1), _.keys(data2)));
    const children = keys
      .map((keyName) => buildComparisonTree(data1[keyName], data2[keyName], keyName));

    if (_.isNull(key)) {
      return children;
    }

    return { key, type: 'nested', children };
  }

  if (_.isUndefined(data1) && !_.isUndefined(data2)) {
    return { key, type: 'added', value2: data2 };
  }

  if (!_.isUndefined(data1) && _.isUndefined(data2)) {
    return { key, type: 'removed', value1: data1 };
  }

  if (!_.isEqual(data1, data2)) {
    return {
      key,
      type: 'updated',
      value1: data1,
      value2: data2,
    };
  }

  return { key, type: 'unchanged', value1: data1 };
};

export { buildComparisonTree, extractFormat, readFile };
