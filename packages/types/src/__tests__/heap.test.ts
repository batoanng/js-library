import { describe, expect, it } from 'vitest';
import { PriorityQueue } from '../structures/heap';

function expectMinHeap<T>(values: T[], compare: (a: T, b: T) => number): void {
  for (let index = 0; index < values.length; index += 1) {
    const left = index * 2 + 1;
    const right = index * 2 + 2;

    if (left < values.length) {
      expect(compare(values[index], values[left])).toBeLessThanOrEqual(0);
    }

    if (right < values.length) {
      expect(compare(values[index], values[right])).toBeLessThanOrEqual(0);
    }
  }
}

describe('PriorityQueue', () => {
  it('returns values in priority order with the default min-heap comparator', () => {
    const queue = new PriorityQueue<number>();

    expect(queue.peek()).toBeUndefined();

    [5, 1, 4, 2, 3].forEach((value) => queue.insert(value));

    expect(queue.size).toBe(5);
    expect(queue.peek()).toBe(1);
    expect(queue.extract()).toBe(1);
    expect(queue.extract()).toBe(2);
    expect(queue.extract()).toBe(3);
    expect(queue.extract()).toBe(4);
    expect(queue.extract()).toBe(5);
    expect(queue.extract()).toBeUndefined();
  });

  it('maintains the heap invariant and supports update and remove', () => {
    const compare = (left: { priority: number }, right: { priority: number }) => left.priority - right.priority;
    const queue = new PriorityQueue(compare);
    const a = { priority: 5 };
    const b = { priority: 3 };
    const c = { priority: 7 };

    queue.insert(a);
    queue.insert(b);
    queue.insert(c);

    a.priority = 1;
    expect(queue.update(a)).toBe(true);
    expect(queue.peek()).toBe(a);

    expect(queue.remove(b)).toBe(true);
    expect(queue.remove(b)).toBe(false);
    expectMinHeap((queue as any).heap, compare);

    const maxQueue = new PriorityQueue<number>((left, right) => right - left);
    [1, 3, 2].forEach((value) => maxQueue.insert(value));
    expect(maxQueue.extract()).toBe(3);
  });
});
