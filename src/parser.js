import YAML from 'yaml';

const parser = (data, format) => {
  const parsedData = format === 'json' ? JSON.parse(data) : YAML.parse(data);
  return parsedData;
};

export default parser;
