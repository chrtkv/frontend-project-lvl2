import { readFileSync } from "fs";

const genDiff = (filePath1, filePath2) => {
  const oldData = JSON.parse(readFileSync(filePath1));
  const newData = JSON.parse(readFileSync(filePath2));

  const keys = [...new Set([...Object.keys(oldData), ...Object.keys(newData)])];

  return keys.reduce((acc, key) => {
    if (oldData[key] === newData[key]) {
      return {
        ...acc,
        [key]: {
          oldValue: oldData[key],
          newValue: newData[key],
          status: "unchanged",
        },
      };
    }
    if (
      Object.keys(oldData).includes(key) &&
      !Object.keys(newData).includes(key)
    ) {
      return {
        ...acc,
        [key]: {
          oldValue: oldData[key],
          newValue: null,
          status: "deleted",
        },
      };
    }
    if (
      !Object.keys(oldData).includes(key) &&
      Object.keys(newData).includes(key)
    ) {
      return {
        ...acc,
        [key]: {
          oldValue: null,
          newValue: newData[key],
          status: "added",
        },
      };
    }
    if (oldData[key] !== newData[key]) {
      return {
        ...acc,
        [key]: {
          oldValue: oldData[key],
          newValue: newData[key],
          status: "changed",
        },
      };
    }
  }, {});
};

export default genDiff;
