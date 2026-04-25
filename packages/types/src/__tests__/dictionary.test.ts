import { describe, expect, it } from 'vitest';
import { Dictionary } from '../structures/dictionary';

describe('Dictionary', () => {
  it('supports primitive and object keys', () => {
    const dictionary = new Dictionary<string | { id: number }, number>();
    const objectKey = { id: 1 };

    dictionary.set('one', 1);
    dictionary.set(objectKey, 2);

    expect(dictionary.get('one')).toBe(1);
    expect(dictionary.get(objectKey)).toBe(2);
    expect(dictionary.has(objectKey)).toBe(true);
  });

  it('updates size only for new keys and reflects current entries', () => {
    const dictionary = new Dictionary<string, number>();
    const visited: Array<[string, number]> = [];

    dictionary.set('a', 1);
    dictionary.set('a', 2);
    dictionary.set('b', 3);

    expect(dictionary.size).toBe(2);
    expect(dictionary.delete('b')).toBe(true);
    expect(dictionary.delete('missing')).toBe(false);
    expect(dictionary.keys()).toEqual(['a']);
    expect(dictionary.values()).toEqual([2]);
    expect(dictionary.entries()).toEqual([['a', 2]]);

    dictionary.forEach((key, value) => visited.push([key, value]));
    expect(visited).toEqual([['a', 2]]);

    dictionary.clear();
    expect(dictionary.size).toBe(0);
  });
});
