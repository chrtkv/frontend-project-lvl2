import jsonFormatter from './json.js';
import plainFormatter from './plain.js';
import stylishFormatter from './stylish.js';

export default (formatName) => {
  switch (formatName) {
    case 'json':
      return jsonFormatter;
    case 'plain':
      return plainFormatter;
    case 'stylish':
      return stylishFormatter;
    default:
      throw new Error(`Unknown format: ${formatName}`);
  }
};
