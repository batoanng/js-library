import { describe, expect, it } from 'vitest';
import { DoublyLinkedList } from '../structures/doubly-linked-list';

describe('DoublyLinkedList', () => {
  it('maintains bidirectional pointers for prepend and append', () => {
    const list = new DoublyLinkedList<number>();
    const first = list.append(2);
    const second = list.prepend(1);
    const third = list.append(3);

    expect(second.next).toBe(first);
    expect(first.prev).toBe(second);
    expect(first.next).toBe(third);
    expect(third.prev).toBe(first);
    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('updates pointers when removing head, tail, and middle nodes', () => {
    const list = new DoublyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.append(3);

    expect(list.removeHead()).toBe(1);
    expect((list as any).head.prev).toBeUndefined();
    expect(list.removeTail()).toBe(3);
    expect((list as any).tail.next).toBeUndefined();

    list.clear();
    list.append(1);
    const inserted = list.append(99);
    list.append(3);

    expect(list.removeNode(inserted)).toBe(99);
    expect(list.toArray()).toEqual([1, 3]);
    expect(list.find(3)?.prev?.value).toBe(1);
    expect(list.size).toBe(2);
  });

  it('resets head and tail when removing the only node', () => {
    const list = new DoublyLinkedList<number>();
    const only = list.append(1);

    expect(list.removeNode(only)).toBe(1);
    expect(list.peekHead()).toBeUndefined();
    expect(list.peekTail()).toBeUndefined();
  });
});
