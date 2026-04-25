export class Stack<T> {
  protected items: T[] = [];

  get size(): number {
    return this.items.length;
  }

  push(value: T): void {
    this.items.push(value);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items.at(-1);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  contains(value: T): boolean {
    return this.items.includes(value);
  }

  clear(): void {
    this.items = [];
  }
}
