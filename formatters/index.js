import jsonFormatter from './json.js';
import plainFormatter from './plain.js';
import stylishFormatter from './stylish.js';

const formatters = {
  json: jsonFormatter,
  plain: plainFormatter,
  stylish: stylishFormatter,
};

export default formatters;
