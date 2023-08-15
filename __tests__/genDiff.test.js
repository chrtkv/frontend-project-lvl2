import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'url';

import genDiff from '../src/genDiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesPath = `${__dirname}/../__fixtures__/`;

const getExpected = (formatterName) => readFileSync(`${fixturesPath}expected.${formatterName}.txt`, 'utf-8');
const getBeforeAfterFiles = (fileFormat) => [fileFormat, `${fixturesPath}before.${fileFormat}`, `${fixturesPath}after.${fileFormat}`];
const getCombinations = (formatters, formats) => formatters
  .flatMap((formatter) => formats
    .map(getBeforeAfterFiles)
    .map((combintation) => [formatter, ...combintation]));

const formattersList = ['plain', 'stylish', 'json'];
const fileFormatsList = ['yml', 'json', 'yaml'];
const combinations = getCombinations(formattersList, fileFormatsList);

describe('genDiff tests', () => {
  test.each(combinations)(
    'use %s formatter with %s files',
    (formatter, fileFormat, filepath1, filepath2) => {
      const expectedResult = getExpected(formatter);
      const actualResult = genDiff(filepath1, filepath2, formatter);
      expect(expectedResult).toEqual(actualResult);
    },
  );

  test('use default formatter', () => {
    const [, filepath1, filepath2] = getBeforeAfterFiles('json');
    const expectedResult = getExpected('stylish');
    const actualResult = genDiff(filepath1, filepath2);
    expect(expectedResult).toEqual(actualResult);
  });
});
