import { readFileSync } from 'fs';
import genDiff from '../src/genDiff';

test('genDiff', () => {
  const expectedResult = readFileSync('./__tests__/__fixtures__/result.txt', 'utf-8');
  const filePath1 = './__tests__/__fixtures__/before.json';
  const filepath2 = './__tests__/__fixtures__/after.json';
  const result = genDiff(filePath1, filepath2);
  expect(result).toEqual(expectedResult);
});
