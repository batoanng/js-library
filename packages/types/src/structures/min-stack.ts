import { defaultComparator, type Comparator } from '../shared';

export class MinStack<T> {
  private values: T[] = [];
  private mins: T[] = [];

  constructor(private readonly compare: Comparator<T> = defaultComparator) {}

  get size(): number {
    return this.values.length;
  }

  push(value: T): void {
    this.values.push(value);

    const currentMin = this.mins.at(-1);
    if (currentMin === undefined || this.compare(value, currentMin) <= 0) {
      this.mins.push(value);
    }
  }

  pop(): T | undefined {
    const value = this.values.pop();

    if (value === undefined) {
      return undefined;
    }

    const currentMin = this.mins.at(-1);
    if (currentMin !== undefined && this.compare(value, currentMin) === 0) {
      this.mins.pop();
    }

    return value;
  }

  peek(): T | undefined {
    return this.values.at(-1);
  }

  min(): T | undefined {
    return this.mins.at(-1);
  }

  isEmpty(): boolean {
    return this.values.length === 0;
  }

  clear(): void {
    this.values = [];
    this.mins = [];
  }
}
