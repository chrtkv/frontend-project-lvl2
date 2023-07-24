import { readFileSync } from 'node:fs';
import { getFixturePath, getRandomElementFromArray } from './__utils__/helpers';

import genDiff from '../src/genDiff';

describe('genDiff tests', () => {
  const fixedTestCases = [
    // formatName, inputFile1, inputFile2, resultFile
    ['default', 'before.json', 'after.json', 'stylish_result.txt'],
    ['stylish', 'before.json', 'after.json', 'stylish_result.txt'],
    ['plain', 'before.json', 'after.json', 'plain_result.txt'],
    ['json', 'before.json', 'after.json', 'json_result.txt'],
    ['default', 'before.yml', 'after.yml', 'stylish_result.txt'],
    ['stylish', 'before.yml', 'after.yml', 'stylish_result.txt'],
    ['plain', 'before.yml', 'after.yml', 'plain_result.txt'],
    ['json', 'before.yml', 'after.yml', 'json_result.txt'],
  ];

  const formatNames = ['plain', 'stylish', 'json'];
  const fileExtensions = ['.yml', '.json'];
  const randomCasesCount = 20;
  const randomTestCases = Array.from({ length: randomCasesCount }, () => {
    const formatter = getRandomElementFromArray(formatNames);
    const file1extension = getRandomElementFromArray(fileExtensions);
    const file2extension = getRandomElementFromArray(fileExtensions);
    return [
      formatter,
      `before${file1extension}`,
      `after${file2extension}`,
      `${formatter}_result.txt`,
    ];
  });

  test.each([...fixedTestCases, ...randomTestCases])(
    'generate diff with %s formatter using %s and %s',
    (formatName, inputFile1, inputFile2, resultFile) => {
      const filePath1 = getFixturePath(inputFile1);
      const filePath2 = getFixturePath(inputFile2);
      const resultPath = getFixturePath(resultFile);

      const expectedResult = readFileSync(resultPath, 'utf-8');
      const result = genDiff(filePath1, filePath2, formatName === 'default' ? undefined : formatName);

      expect(result).toEqual(expectedResult);
    },
  );
});
