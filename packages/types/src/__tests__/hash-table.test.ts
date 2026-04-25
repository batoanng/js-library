import { describe, expect, it } from 'vitest';
import { HashTable } from '../structures/hash-table';

describe('HashTable', () => {
  it('stores and retrieves values, including structural object keys', () => {
    const table = new HashTable<object | string, number>();

    table.put('one', 1);
    table.put({ id: 1, nested: { ok: true } }, 2);

    expect(table.get('one')).toBe(1);
    expect(table.get({ id: 1, nested: { ok: true } })).toBe(2);
    expect(table.has({ id: 1, nested: { ok: true } })).toBe(true);
  });

  it('updates existing keys, handles collisions, and removes missing keys safely', () => {
    const table = new HashTable<string, number>();

    (table as any).capacity = 1;
    (table as any).buckets = [[]];

    table.put('a', 1);
    table.put('b', 2);
    table.put('a', 3);

    expect(table.size).toBe(2);
    expect(table.get('a')).toBe(3);
    expect(table.get('b')).toBe(2);
    expect(table.remove('a')).toBe(true);
    expect(table.remove('missing')).toBe(false);
    expect(table.get('a')).toBeUndefined();
  });

  it('resizes when the load factor grows and preserves values', () => {
    const table = new HashTable<string, number>();

    for (let index = 0; index < 20; index += 1) {
      table.put(`key-${index}`, index);
    }

    expect((table as any).capacity).toBeGreaterThan(16);

    for (let index = 0; index < 20; index += 1) {
      expect(table.get(`key-${index}`)).toBe(index);
    }

    table.clear();
    expect(table.size).toBe(0);
  });
});
