'use strict';
import type { NestedArray } from './commonTypes';

export function flattenArray<T>(array: NestedArray<T>): T[] {
  if (!Array.isArray(array)) {
    return [array];
  }

  const result: T[] = [];
  const stack = [array];

  while (stack.length > 0) {
    const value = stack.pop()!;

    if (Array.isArray(value)) {
      for (let i = value.length - 1; i >= 0; i--) {
        stack.push(value[i]);
      }
    } else {
      result.push(value);
    }
  }

  return result;
}

export const has = <K extends string>(
  key: K,
  x: unknown
): x is { [key in K]: unknown } => {
  if (typeof x === 'function' || typeof x === 'object') {
    if (x === null || x === undefined) {
      return false;
    } else {
      return key in x;
    }
  }
  return false;
};
