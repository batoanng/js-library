import type { DoublyNode } from '../shared';

export class Deque<T> {
  private head?: DoublyNode<T>;
  private tail?: DoublyNode<T>;
  private count = 0;

  get size(): number {
    return this.count;
  }

  addFront(value: T): void {
    const node: DoublyNode<T> = { value, next: this.head };

    if (this.head) {
      this.head.prev = node;
    } else {
      this.tail = node;
    }

    this.head = node;
    this.count += 1;
  }

  addBack(value: T): void {
    const node: DoublyNode<T> = { value, prev: this.tail };

    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }

    this.tail = node;
    this.count += 1;
  }

  removeFront(): T | undefined {
    if (!this.head) {
      return undefined;
    }

    const value = this.head.value;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = undefined;
    } else {
      this.tail = undefined;
    }

    this.count -= 1;
    return value;
  }

  removeBack(): T | undefined {
    if (!this.tail) {
      return undefined;
    }

    const value = this.tail.value;
    this.tail = this.tail.prev;

    if (this.tail) {
      this.tail.next = undefined;
    } else {
      this.head = undefined;
    }

    this.count -= 1;
    return value;
  }

  peekFront(): T | undefined {
    return this.head?.value;
  }

  peekBack(): T | undefined {
    return this.tail?.value;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  contains(value: T): boolean {
    let current = this.head;

    while (current) {
      if (Object.is(current.value, value)) {
        return true;
      }

      current = current.next;
    }

    return false;
  }

  clear(): void {
    this.head = undefined;
    this.tail = undefined;
    this.count = 0;
  }
}
