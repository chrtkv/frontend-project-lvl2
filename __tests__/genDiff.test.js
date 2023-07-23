import * as path from 'node:path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'node:fs';
import genDiff from '../src/genDiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

// TODO: compose into test function with files as parameters
test('diff with json and default formatter', () => {
  const expectedResult = readFileSync(getFixturePath('stylish_result.txt'), 'utf-8');
  const fileName1 = 'before.json';
  const fileName2 = 'after.json';
  const result = genDiff(getFixturePath(fileName1), getFixturePath(fileName2));
  expect(result).toEqual(expectedResult);
});

test('stylish diff with json', () => {
  const expectedResult = readFileSync(getFixturePath('stylish_result.txt'), 'utf-8');
  const fileName1 = 'before.json';
  const fileName2 = 'after.json';
  const result = genDiff(getFixturePath(fileName1), getFixturePath(fileName2), 'stylish');
  expect(result).toEqual(expectedResult);
});

test('stylish diff with yaml', () => {
  const expectedResult = readFileSync(getFixturePath('stylish_result.txt'), 'utf-8');
  const fileName1 = 'before.yml';
  const fileName2 = 'after.yml';
  const result = genDiff(getFixturePath(fileName1), getFixturePath(fileName2), 'stylish');
  expect(result).toEqual(expectedResult);
});

test('stylish diff with different formats', () => {
  const expectedResult = readFileSync(getFixturePath('stylish_result.txt'), 'utf-8');
  const fileName1 = 'before.json';
  const fileName2 = 'after.yml';
  const result = genDiff(getFixturePath(fileName1), getFixturePath(fileName2), 'stylish');
  expect(result).toEqual(expectedResult);
});

test('plain diff with json', () => {
  const expectedResult = readFileSync(getFixturePath('plain_result.txt'), 'utf-8');
  const fileName1 = 'before.json';
  const fileName2 = 'after.json';
  const result = genDiff(getFixturePath(fileName1), getFixturePath(fileName2), 'plain');
  expect(result).toEqual(expectedResult);
});

test('json diff with json', () => {
  const expectedResult = readFileSync(getFixturePath('json_result.txt'), 'utf-8');
  const fileName1 = 'before.json';
  const fileName2 = 'after.json';
  const result = genDiff(getFixturePath(fileName1), getFixturePath(fileName2), 'json');
  expect(result).toEqual(expectedResult);
});
