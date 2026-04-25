import { describe, expect, it } from 'vitest';
import { MySet } from '../structures/set';

describe('MySet', () => {
  it('prevents duplicate values and updates size', () => {
    const set = new MySet<number>();

    expect(set.add(1)).toBe(true);
    expect(set.add(1)).toBe(false);
    expect(set.has(1)).toBe(true);
    expect(set.size).toBe(1);
    expect(set.delete(1)).toBe(true);
    expect(set.delete(1)).toBe(false);
  });

  it('supports union, intersection, difference, subset, and clear', () => {
    const left = new MySet<number>();
    const right = new MySet<number>();

    [1, 2, 3].forEach((value) => left.add(value));
    [3, 4].forEach((value) => right.add(value));

    expect(left.union(right).values()).toEqual([1, 2, 3, 4]);
    expect(left.intersection(right).values()).toEqual([3]);
    expect(left.difference(right).values()).toEqual([1, 2]);
    expect(new MySet<number>().isSubsetOf(left)).toBe(true);
    expect(right.isSubsetOf(left)).toBe(false);

    left.clear();
    expect(left.size).toBe(0);
  });
});
