import type { LinkedListNode } from '../shared';

export class LinkedList<T> {
  private head?: LinkedListNode<T>;
  private tail?: LinkedListNode<T>;
  private count = 0;

  get size(): number {
    return this.count;
  }

  prepend(value: T): void {
    const node: LinkedListNode<T> = { value, next: this.head };
    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }

    this.count += 1;
  }

  append(value: T): void {
    const node: LinkedListNode<T> = { value };

    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.count += 1;
      return;
    }

    this.tail!.next = node;
    this.tail = node;
    this.count += 1;
  }

  removeHead(): T | undefined {
    if (!this.head) {
      return undefined;
    }

    const value = this.head.value;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = undefined;
    }

    this.count -= 1;
    return value;
  }

  headValue(): T | undefined {
    return this.head?.value;
  }

  tailValue(): T | undefined {
    return this.tail?.value;
  }

  insertAt(index: number, value: T): boolean {
    if (index < 0 || index > this.count) {
      return false;
    }

    if (index === 0) {
      this.prepend(value);
      return true;
    }

    if (index === this.count) {
      this.append(value);
      return true;
    }

    let previous = this.head!;

    for (let currentIndex = 1; currentIndex < index; currentIndex += 1) {
      previous = previous.next!;
    }

    previous.next = { value, next: previous.next };
    this.count += 1;
    return true;
  }

  removeAt(index: number): T | undefined {
    if (index < 0 || index >= this.count) {
      return undefined;
    }

    if (index === 0) {
      return this.removeHead();
    }

    let previous = this.head!;

    for (let currentIndex = 1; currentIndex < index; currentIndex += 1) {
      previous = previous.next!;
    }

    const target = previous.next!;
    previous.next = target.next;

    if (!previous.next) {
      this.tail = previous;
    }

    this.count -= 1;
    return target.value;
  }

  indexOf(value: T): number {
    let current = this.head;
    let index = 0;

    while (current) {
      if (Object.is(current.value, value)) {
        return index;
      }

      current = current.next;
      index += 1;
    }

    return -1;
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
}
