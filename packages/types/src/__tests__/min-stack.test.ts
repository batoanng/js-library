import { describe, expect, it } from 'vitest';
import { MinStack } from '../structures/min-stack';

describe('MinStack', () => {
  it('returns undefined minimum when empty', () => {
    const stack = new MinStack<number>();

    expect(stack.min()).toBeUndefined();
    expect(stack.pop()).toBeUndefined();
  });

  it('tracks minimum values in O(1)', () => {
    const stack = new MinStack<number>();

    stack.push(5);
    expect(stack.min()).toBe(5);

    stack.push(3);
    expect(stack.min()).toBe(3);

    stack.push(7);
    expect(stack.min()).toBe(3);

    stack.push(3);
    expect(stack.min()).toBe(3);

    expect(stack.pop()).toBe(3);
    expect(stack.min()).toBe(3);
    expect(stack.pop()).toBe(7);
    expect(stack.min()).toBe(3);
    expect(stack.pop()).toBe(3);
    expect(stack.min()).toBe(5);
  });
});
