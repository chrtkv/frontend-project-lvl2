import { readFileSync } from 'node:fs';
import getFixturePath from './__utils__/helpers';

import genDiff from '../src/genDiff';

describe('genDiff tests', () => {
  const formatNames = ['plain', 'stylish', 'json', 'default'];
  const fileExtensions = ['.yml', '.json', '.yaml'];

  const getAllCombinations = (formats, extensions, defaultFormat = 'stylish') => formats
    .flatMap((format) => {
      const formatName = format === 'default' ? defaultFormat : format;
      return extensions
        .flatMap((ext1) => extensions.map((ext2) => [
          formatName,
          `before${ext1}`,
          `after${ext2}`,
          `${formatName}_result.txt`,
        ]));
    });

  const combinations = getAllCombinations(formatNames, fileExtensions);

  test.each(combinations)(
    'generate diff with %s formatter using %s and %s',
    (formatName, inputFile1, inputFile2, resultFile) => {
      const filepath1 = getFixturePath(inputFile1);
      const filepath2 = getFixturePath(inputFile2);
      const resultPath = getFixturePath(resultFile);

      const expectedResult = readFileSync(resultPath, 'utf-8');
      const result = genDiff(filepath1, filepath2, formatName === 'default' ? undefined : formatName);

      expect(result).toEqual(expectedResult);
    },
  );
});
