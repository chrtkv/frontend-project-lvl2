import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'url';

import genDiff from '../src/genDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesPath = `${__dirname}/__fixtures__/`;

const getExpected = (formatter) => readFileSync(`${fixturesPath}expected.${formatter}.txt`, 'utf-8');
const getBeforeAfterFiles = (fileFormat) => [
  `${fixturesPath}before.${fileFormat}`,
  `${fixturesPath}after.${fileFormat}`,
];

const formatters = ['plain', 'stylish', 'json'];
const fileFormats = ['yml', 'json', 'yaml'];

describe.each(formatters)('%s formatter', (formatter) => {
  it.each(fileFormats)('should work with %s file', (fileFormat) => {
    const [filepath1, filepath2] = getBeforeAfterFiles(fileFormat);
    const actualResult = genDiff(filepath1, filepath2, formatter);
    const expectedResult = getExpected(formatter);
    expect(actualResult).toEqual(expectedResult);
  });
});

describe('default formatter', () => {
  it('should be stylish', () => {
    const [filepath1, filepath2] = getBeforeAfterFiles('json');
    const actualResult = genDiff(filepath1, filepath2);
    const expectedResult = getExpected('stylish');
    expect(actualResult).toEqual(expectedResult);
  });
});
