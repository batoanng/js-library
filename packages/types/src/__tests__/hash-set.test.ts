import { describe, expect, it } from 'vitest';
import { HashSet } from '../structures/hash-set';

describe('HashSet', () => {
  it('adds and deletes unique values', () => {
    const set = new HashSet<string>();

    expect(set.add('a')).toBe(true);
    expect(set.add('a')).toBe(false);
    expect(set.has('a')).toBe(true);
    expect(set.delete('a')).toBe(true);
    expect(set.delete('a')).toBe(false);
  });

  it('inherits structural hashing and resize behavior from the hash table', () => {
    const set = new HashSet<object>();

    for (let index = 0; index < 20; index += 1) {
      expect(set.add({ value: index })).toBe(true);
    }

    expect(set.has({ value: 10 })).toBe(true);
    expect(set.size).toBe(20);

    set.clear();
    expect(set.size).toBe(0);
  });
});
