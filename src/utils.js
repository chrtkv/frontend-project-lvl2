import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const readFile = (filepath) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  return fs.readFileSync(fullPath, 'utf-8');
};

const extractFormat = (filepath) => {
  const extension = path.extname(filepath);
  return extension.slice(1);
};

const buildComparisonTree = (data1, data2) => {
  const iter = (innerData1, innerData2, keyName) => {
    if (_.isPlainObject(innerData1) && _.isPlainObject(innerData2)) {
      const keys = _.sortBy(_.union(_.keys(innerData1), _.keys(innerData2)));
      const children = keys.map((key) => iter(innerData1[key], innerData2[key], key));

      if (_.isUndefined(keyName)) {
        return children;
      }

      return {
        children,
        key: keyName,
        type: 'nested',
      };
    }

    if (_.isUndefined(innerData1) && !_.isUndefined(innerData2)) {
      return {
        key: keyName,
        type: 'added',
        value2: innerData2,
      };
    }
    if (!_.isUndefined(innerData1) && _.isUndefined(innerData2)) {
      return {
        key: keyName,
        type: 'removed',
        value1: innerData1,
      };
    }
    if (!_.isEqual(innerData1, innerData2)) {
      return {
        key: keyName,
        type: 'updated',
        value1: innerData1,
        value2: innerData2,
      };
    }

    return {
      key: keyName,
      type: 'unchanged',
      value1: innerData1,
    };
  };

  return iter(data1, data2);
};

export { buildComparisonTree, extractFormat, readFile };
