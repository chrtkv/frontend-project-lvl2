const compare = (oldData, newData) => {
  const isObject = (value) => typeof value === 'object' && !Array.isArray(value) && value !== null;

  if (isObject(oldData) && isObject(newData)) {
    const keys = [...new Set([...Object.keys(oldData), ...Object.keys(newData)])];
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
