export class Queue<T> {
  private items = new Map<number, T>();
  private head = 0;
  private tail = 0;

  get size(): number {
    return this.tail - this.head;
  }

  enqueue(value: T): void {
    this.items.set(this.tail, value);
    this.tail += 1;
  }

  dequeue(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    const value = this.items.get(this.head);
    this.items.delete(this.head);
    this.head += 1;
    return value;
  }

  peek(): T | undefined {
    return this.items.get(this.head);
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  contains(value: T): boolean {
    for (const entry of this.items.values()) {
      if (Object.is(entry, value)) {
        return true;
      }
    }

    return false;
  }

  clear(): void {
    this.items = new Map<number, T>();
    this.head = 0;
    this.tail = 0;
  }
}
