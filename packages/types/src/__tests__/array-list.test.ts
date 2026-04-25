import { describe, expect, it } from 'vitest';
import { ArrayList } from '../structures/array-list';

describe('ArrayList', () => {
  it('starts empty and supports indexed access updates', () => {
    const list = new ArrayList<number>();

    expect(list.size).toBe(0);
    expect(list.get(0)).toBeUndefined();

    list.push(10);
    list.push(20);

    expect(list.size).toBe(2);
    expect(list.get(0)).toBe(10);
    expect(list.get(1)).toBe(20);
    expect(list.set(1, 25)).toBe(true);
    expect(list.set(10, 99)).toBe(false);
    expect(list.get(1)).toBe(25);
  });

  it('supports append, insert, search, removal, and clearing', () => {
    const list = new ArrayList<number>();

    list.push(1);
    list.push(3);
    expect(list.insertAt(1, 2)).toBe(true);
    expect(list.insertAt(10, 4)).toBe(false);
    expect(list.toArray()).toEqual([1, 2, 3]);
    expect(list.search(2)).toBe(1);
    expect(list.removeAt(1)).toBe(2);
    expect(list.pop()).toBe(3);
    expect(list.pop()).toBe(1);
    expect(list.pop()).toBeUndefined();

    list.push(5);
    list.clear();
    expect(list.size).toBe(0);
    expect(list.toArray()).toEqual([]);
  });
});
