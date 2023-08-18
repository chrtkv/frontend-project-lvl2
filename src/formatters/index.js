import plainFormatter from './plain';
import stylishFormatter from './stylish';

export default (tree, formatName) => {
  const formatterMapping = {
    json: JSON.stringify,
    plain: plainFormatter,
    stylish: stylishFormatter,
  };

  const formatter = formatterMapping[formatName];

  if (!formatter) {
    throw new Error(`Unknown format: ${formatName}`);
  }

  return formatter(tree);
};
