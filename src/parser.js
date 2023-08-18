import YAML from 'yaml';

export default (data, fileFormat) => {
  switch (fileFormat) {
    case 'yml':
    case 'yaml':
      return YAML.parse(data);
    case 'json':
      return JSON.parse(data);
    default:
      throw new Error(`Unknown file format: ${fileFormat}`);
  }
};
