import _ from 'lodash';

const compare = (oldData, newData) => {
  if (_.isPlainObject(oldData) && _.isPlainObject(newData)) {
    const keys = _.union(_.keys(oldData), _.keys(newData));
    return keys.reduce((acc, key) => {
      const result = compare(oldData[key], newData[key]);
      return { ...acc, [key]: result };
    }, {});
  }

  const result = {
    oldValue: oldData,
    newValue: newData,
  };

  if (oldData === newData) {
    return { ...result, status: 'unchanged' };
  }

  if (oldData !== undefined && newData === undefined) {
    return { ...result, status: 'removed' };
  }

  if (oldData === undefined && newData !== undefined) {
    return { ...result, status: 'added' };
  }

  return { ...result, status: 'updated' };
};

export default compare;
