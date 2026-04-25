import type { CircularNode } from '../shared';

export class CircularLinkedList<T> {
  private tail?: CircularNode<T>;
  private count = 0;

  get size(): number {
    return this.count;
  }

  append(value: T): void {
    const node = this.createNode(value);

    if (!this.tail) {
      this.tail = node;
      this.count = 1;
      return;
    }

    node.next = this.tail.next;
    this.tail.next = node;
    this.tail = node;
    this.count += 1;
  }

  prepend(value: T): void {
    const node = this.createNode(value);

    if (!this.tail) {
      this.tail = node;
      this.count = 1;
      return;
    }

    node.next = this.tail.next;
    this.tail.next = node;
    this.count += 1;
  }

  removeHead(): T | undefined {
    if (!this.tail) {
      return undefined;
    }

    const head = this.tail.next;

    if (this.tail === head) {
      this.tail = undefined;
      this.count = 0;
      return head.value;
    }

    this.tail.next = head.next;
    this.count -= 1;
    return head.value;
  }

  peekHead(): T | undefined {
    return this.tail?.next.value;
  }

  peekTail(): T | undefined {
    return this.tail?.value;
  }

  rotate(): T | undefined {
    if (!this.tail) {
      return undefined;
    }

    this.tail = this.tail.next;
    return this.tail.next.value;
  }

  find(value: T): CircularNode<T> | undefined {
    if (!this.tail) {
      return undefined;
    }

    let current = this.tail.next;

    for (let index = 0; index < this.count; index += 1) {
      if (Object.is(current.value, value)) {
        return current;
      }

      current = current.next;
    }

    return undefined;
  }

  removeByValue(value: T): boolean {
    if (!this.tail) {
      return false;
    }

    let previous = this.tail;
    let current = this.tail.next;

    for (let index = 0; index < this.count; index += 1) {
      if (Object.is(current.value, value)) {
        if (current === previous) {
          this.tail = undefined;
          this.count = 0;
          return true;
        }

        previous.next = current.next;
        if (current === this.tail) {
          this.tail = previous;
        }

        this.count -= 1;
        return true;
      }

      previous = current;
      current = current.next;
    }

    return false;
  }

  clear(): void {
    this.tail = undefined;
    this.count = 0;
  }

  toArray(): T[] {
    if (!this.tail) {
      return [];
    }

    const values: T[] = [];
    let current = this.tail.next;

    for (let index = 0; index < this.count; index += 1) {
      values.push(current.value);
      current = current.next;
    }

    return values;
  }

  private createNode(value: T): CircularNode<T> {
    const node = { value } as CircularNode<T>;
    node.next = node;
    return node;
  }
}
