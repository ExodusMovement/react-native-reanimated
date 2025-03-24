import { flattenArray as newFlattenArray } from '../src/createAnimatedComponent/utils';

type NestedArray<T> = T | NestedArray<T>[];

function oldFlattenArray<T>(array: NestedArray<T>): T[] {
  if (!Array.isArray(array)) {
    return [array];
  }

  const resultArr: T[] = [];
  const _flattenArray = (arr: NestedArray<T>[]) => {
    arr.forEach((item) => {
      if (Array.isArray(item)) {
        _flattenArray(item);
      } else {
        resultArr.push(item);
      }
    });
  };

  _flattenArray(array);
  return resultArr;
}

const createDeepNestedArray = (depth: number): NestedArray<number> => {
  let arr: NestedArray<number> = 1;
  for (let i = 0; i < depth; i++) {
    arr = [arr];
  }
  return arr;
};

describe('flattenArray - deep nesting edge case', () => {
  const depth = 10000;
  const deepArray = createDeepNestedArray(depth);

  it('new implementation handles deeply nested array', () => {
    expect(() => newFlattenArray(deepArray)).not.toThrow();
    expect(newFlattenArray(deepArray)).toEqual([1]);
  });

  it('old implementation throws RangeError (stack overflow)', () => {
    expect(() => oldFlattenArray(deepArray)).toThrow(RangeError);
  });
});

describe('flattenArray - backward compatibility', () => {
  const testCases = [
    { input: 1, description: 'non-array input (number)' },
    { input: 'hello', description: 'non-array input (string)' },
    { input: [], description: 'empty array' },
    { input: [1, 2, 3], description: 'flat array' },
    { input: [1, [2, 3]], description: '1-level nested array' },
    { input: [1, [2, [3, [4]]]], description: 'deeply nested array' },
    { input: [[[[1]]]], description: 'nested single value' },
    { input: [[], [[], 1], 2], description: 'sparse nested arrays' },
    { input: ['a', ['b', ['c']], 'd'], description: 'nested strings' },
    { input: [null, [undefined, [false]]], description: 'falsy values' },
  ];

  testCases.forEach(({ input, description }) => {
    it(`produces same output for ${description}`, () => {
      const oldOutput = oldFlattenArray(input);
      const newOutput = newFlattenArray(input);
      expect(newOutput).toEqual(oldOutput);
    });
  });
});
