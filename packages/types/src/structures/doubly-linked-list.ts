import type { DoublyNode } from '../shared';

export class DoublyLinkedList<T> {
  private head?: DoublyNode<T>;
  private tail?: DoublyNode<T>;
  private count = 0;

  get size(): number {
    return this.count;
  }

  prepend(value: T): DoublyNode<T> {
    const node: DoublyNode<T> = { value, next: this.head };

    if (this.head) {
      this.head.prev = node;
    } else {
      this.tail = node;
    }

    this.head = node;
    this.count += 1;
    return node;
  }

  append(value: T): DoublyNode<T> {
    const node: DoublyNode<T> = { value, prev: this.tail };

    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }

    this.tail = node;
    this.count += 1;
    return node;
  }

  removeHead(): T | undefined {
    if (!this.head) {
      return undefined;
    }

    const value = this.head.value;
    this.unlinkNode(this.head);
    return value;
  }

  removeTail(): T | undefined {
    if (!this.tail) {
      return undefined;
    }

    const value = this.tail.value;
    this.unlinkNode(this.tail);
    return value;
  }

  removeNode(node: DoublyNode<T>): T {
    const value = node.value;
    this.unlinkNode(node);
    return value;
  }

  peekHead(): T | undefined {
    return this.head?.value;
  }

  peekTail(): T | undefined {
    return this.tail?.value;
  }

  find(value: T): DoublyNode<T> | undefined {
    let current = this.head;

    while (current) {
      if (Object.is(current.value, value)) {
        return current;
      }

      current = current.next;
    }

    return undefined;
  }

  insertAt(index: number, value: T): DoublyNode<T> | undefined {
    if (index < 0 || index > this.count) {
      return undefined;
    }

    if (index === 0) {
      return this.prepend(value);
    }

    if (index === this.count) {
      return this.append(value);
    }

    let current = this.head!;

    for (let currentIndex = 0; currentIndex < index; currentIndex += 1) {
      current = current.next!;
    }

    const node: DoublyNode<T> = {
      value,
      prev: current.prev,
      next: current,
    };

    current.prev!.next = node;
    current.prev = node;
    this.count += 1;
    return node;
  }

  clear(): void {
    this.head = undefined;
    this.tail = undefined;
    this.count = 0;
  }

  toArray(): T[] {
    const values: T[] = [];
    let current = this.head;

    while (current) {
      values.push(current.value);
      current = current.next;
    }

    return values;
  }

  private unlinkNode(node: DoublyNode<T>): void {
    const target = node;

    if (target.prev) {
      target.prev.next = target.next;
    } else {
      this.head = target.next;
    }

    if (target.next) {
      target.next.prev = target.prev;
    } else {
      this.tail = target.prev;
    }

    target.prev = undefined;
    target.next = undefined;
    this.count -= 1;
  }
}
