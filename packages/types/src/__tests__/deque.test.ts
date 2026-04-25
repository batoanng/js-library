import { describe, expect, it } from 'vitest';
import { Deque } from '../structures/deque';

describe('Deque', () => {
  it('supports front and back operations for one item', () => {
    const deque = new Deque<number>();

    deque.addFront(1);
    expect(deque.peekFront()).toBe(1);
    expect(deque.peekBack()).toBe(1);
    expect(deque.removeBack()).toBe(1);
    expect(deque.removeBack()).toBeUndefined();

    deque.addBack(2);
    expect(deque.removeFront()).toBe(2);
    expect(deque.isEmpty()).toBe(true);
  });

  it('preserves expected order under mixed operations', () => {
    const deque = new Deque<number>();

    deque.addBack(2);
    deque.addFront(1);
    deque.addBack(3);
    deque.addFront(0);

    expect(deque.contains(2)).toBe(true);
    expect(deque.peekFront()).toBe(0);
    expect(deque.peekBack()).toBe(3);
    expect(deque.removeFront()).toBe(0);
    expect(deque.removeBack()).toBe(3);
    expect(deque.removeFront()).toBe(1);
    expect(deque.removeBack()).toBe(2);
    expect(deque.peekFront()).toBeUndefined();
    expect(deque.peekBack()).toBeUndefined();
    expect(deque.size).toBe(0);
  });
});
