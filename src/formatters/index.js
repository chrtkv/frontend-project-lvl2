import plainFormatter from './plain.js';
import stylishFormatter from './stylish.js';

export default {
  json: JSON.stringify,
  plain: plainFormatter,
  stylish: stylishFormatter,
};
