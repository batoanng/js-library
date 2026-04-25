export class ArrayList<T> {
  private items: T[] = [];

  get size(): number {
    return this.items.length;
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  set(index: number, value: T): boolean {
    if (index < 0 || index >= this.items.length) {
      return false;
    }

    this.items[index] = value;
    return true;
  }

  push(value: T): void {
    this.items.push(value);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  insertAt(index: number, value: T): boolean {
    if (index < 0 || index > this.items.length) {
      return false;
    }

    this.items.splice(index, 0, value);
    return true;
  }

  removeAt(index: number): T | undefined {
    if (index < 0 || index >= this.items.length) {
      return undefined;
    }

    return this.items.splice(index, 1)[0];
  }

  search(value: T): number {
    return this.items.indexOf(value);
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return [...this.items];
  }
}
