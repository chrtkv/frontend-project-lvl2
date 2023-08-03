import _ from 'lodash';
import path from 'path';
import fs from 'fs';

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
        type: 'nested',
        key: keyName,
        children,
      };
    }

    let type;
    if (_.isUndefined(innerData1) && !_.isUndefined(innerData2)) {
      type = 'added';
    } else if (!_.isUndefined(innerData1) && _.isUndefined(innerData2)) {
      type = 'removed';
    } else if (!_.isEqual(innerData1, innerData2)) {
      type = 'updated';
    } else if (_.isEqual(innerData1, innerData2)) {
      type = 'unchanged';
    }

    return {
      type,
      key: keyName,
      value1: innerData1,
      value2: innerData2,
    };
  };

  return iter(data1, data2);
};

export { readFile, extractFormat, buildComparisonTree };
