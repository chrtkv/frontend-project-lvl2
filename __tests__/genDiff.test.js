import * as path from 'node:path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'node:fs';
import genDiff from '../src/genDiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('genDiff', () => {
  const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);
  const expectedResult = readFileSync(getFixturePath('result.txt'), 'utf-8');
  const fileName1 = 'before.json';
  const fileName2 = 'after.json';
  const result = genDiff(getFixturePath(fileName1), getFixturePath(fileName2));
  expect(result).toEqual(expectedResult);
});
