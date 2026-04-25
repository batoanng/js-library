import { describe, expect, it } from 'vitest';
import { CircularLinkedList } from '../structures/circular-linked-list';

describe('CircularLinkedList', () => {
  it('makes a one-node list point to itself', () => {
    const list = new CircularLinkedList<number>();
    list.append(1);

    const tail = (list as any).tail;
    expect(tail.value).toBe(1);
    expect(tail.next).toBe(tail);
  });

  it('supports append, prepend, rotation, and circular traversal', () => {
    const list = new CircularLinkedList<number>();

    list.append(2);
    list.append(3);
    list.prepend(1);

    expect(list.peekHead()).toBe(1);
    expect(list.peekTail()).toBe(3);
    expect(list.rotate()).toBe(2);
    expect(list.peekHead()).toBe(2);
    expect(list.find(3)?.value).toBe(3);
    expect(list.toArray()).toEqual([2, 3, 1]);

    const tail = (list as any).tail;
    let current = tail.next;

    for (let index = 0; index < list.size; index += 1) {
      current = current.next;
    }

    expect(current).toBe(tail.next);
  });

  it('handles head removal for one-node and multi-node lists', () => {
    const list = new CircularLinkedList<number>();

    list.append(1);
    expect(list.removeHead()).toBe(1);
    expect(list.removeHead()).toBeUndefined();

    list.append(1);
    list.append(2);
    list.append(3);
    expect(list.removeHead()).toBe(1);
    expect(list.removeByValue(3)).toBe(true);
    expect(list.toArray()).toEqual([2]);
    expect(list.peekTail()).toBe(2);
  });
});
