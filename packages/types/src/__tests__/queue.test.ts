import { describe, expect, it } from 'vitest';
import { Queue } from '../structures/queue';

describe('Queue', () => {
  it('preserves FIFO ordering and size updates', () => {
    const queue = new Queue<number>();

    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    expect(queue.size).toBe(3);
    expect(queue.peek()).toBe(1);
    expect(queue.contains(2)).toBe(true);
    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBeUndefined();
    expect(queue.size).toBe(0);
  });

  it('keeps ordering stable after many enqueue and dequeue operations', () => {
    const queue = new Queue<number>();

    for (let value = 0; value < 50; value += 1) {
      queue.enqueue(value);
    }

    for (let value = 0; value < 25; value += 1) {
      expect(queue.dequeue()).toBe(value);
    }

    for (let value = 50; value < 75; value += 1) {
      queue.enqueue(value);
    }

    for (let value = 25; value < 75; value += 1) {
      expect(queue.dequeue()).toBe(value);
    }

    expect(queue.isEmpty()).toBe(true);

    queue.enqueue(1);
    queue.clear();
    expect(queue.size).toBe(0);
    expect(queue.peek()).toBeUndefined();
  });
});
