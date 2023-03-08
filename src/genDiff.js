import { readFileSync } from "fs";

// TODO: split to modules
const compareDataChanges = (oldData, newData) => {
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


const formatOutput = (data, format = null) => {
  const sortedKeys = Object.keys(data).sort();
  const formattedLines = sortedKeys.reduce((acc, key) => {
    const { status, oldValue, newValue } = data[key];
    if (status === 'unchanged') {
      acc = [
        ...acc,
        `  ${key}: ${oldValue}`
      ];
    }
    if (status === 'changed') {
      acc = [
        ...acc,
        `  - ${key}: ${oldValue}`,
        `  + ${key}: ${newValue}`,
      ];
    }
    if (status === 'deleted') {
      acc = [
        ...acc,
        `  - ${key}: ${oldValue}`,
      ];
    }
    if (status === 'added') {
      acc = [
        ...acc,
        `  + ${key}: ${newValue}`,
      ];
    }
    return acc;
  }, [])
  return `{\n${formattedLines.join('\n')}\n}`;
}


const genDiff = (filePath1, filePath2) => {
  const oldData = JSON.parse(readFileSync(filePath1));
  const newData = JSON.parse(readFileSync(filePath2));
  const comparedData = compareDataChanges(oldData, newData);

  return formatOutput(comparedData);
}


export default genDiff;
