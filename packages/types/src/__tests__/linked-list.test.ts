import { describe, expect, it } from 'vitest';
import { LinkedList } from '../structures/linked-list';

describe('LinkedList', () => {
  it('sets head and tail correctly for prepend and append', () => {
    const prependList = new LinkedList<number>();
    prependList.prepend(1);
    expect(prependList.headValue()).toBe(1);
    expect(prependList.tailValue()).toBe(1);

    const appendList = new LinkedList<number>();
    appendList.append(2);
    expect(appendList.headValue()).toBe(2);
    expect(appendList.tailValue()).toBe(2);
  });

  it('preserves order and supports indexed operations', () => {
    const list = new LinkedList<number>();

    list.append(2);
    list.append(4);
    list.prepend(1);
    list.insertAt(2, 3);

    expect(list.toArray()).toEqual([1, 2, 3, 4]);
    expect(list.indexOf(3)).toBe(2);
    expect(list.removeAt(2)).toBe(3);
    expect(list.removeHead()).toBe(1);
    expect(list.toArray()).toEqual([2, 4]);
    expect(list.size).toBe(2);
  });

  it('resets tail when the final node is removed', () => {
    const list = new LinkedList<number>();

    list.append(1);
    expect(list.removeHead()).toBe(1);
    expect(list.headValue()).toBeUndefined();
    expect(list.tailValue()).toBeUndefined();
  });
});
