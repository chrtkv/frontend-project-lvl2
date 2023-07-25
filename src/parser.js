import YAML from 'yaml';

export default (data, extension) => {
  switch (extension) {
    case '.yml':
    case '.yaml':
      return YAML.parse(data);
    case '.json':
      return JSON.parse(data);
    default:
      throw new Error(`Unknown extension ${extension}`);
  }
};
