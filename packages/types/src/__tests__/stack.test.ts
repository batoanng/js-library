import { describe, expect, it } from 'vitest';
import { Stack } from '../structures/stack';

describe('Stack', () => {
  it('supports LIFO behavior and size tracking', () => {
    const stack = new Stack<number>();

    expect(stack.isEmpty()).toBe(true);
    expect(stack.peek()).toBeUndefined();

    stack.push(1);
    stack.push(2);
    stack.push(3);

    expect(stack.size).toBe(3);
    expect(stack.peek()).toBe(3);
    expect(stack.contains(2)).toBe(true);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.pop()).toBeUndefined();
    expect(stack.size).toBe(0);
  });

  it('clears all values', () => {
    const stack = new Stack<string>();

    stack.push('a');
    stack.push('b');
    stack.clear();

    expect(stack.isEmpty()).toBe(true);
    expect(stack.peek()).toBeUndefined();
    expect(stack.contains('a')).toBe(false);
  });
});
