import { defaultComparator, type Comparator } from '../shared';

export class PriorityQueue<T> {
  private heap: T[] = [];
  private indexMap = new Map<T, Set<number>>();

  constructor(private readonly compare: Comparator<T> = defaultComparator) {}

  get size(): number {
    return this.heap.length;
  }

  insert(value: T): void {
    this.heap.push(value);
    this.addIndex(value, this.heap.length - 1);
    this.siftUp(this.heap.length - 1);
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  extract(): T | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    return this.removeAt(0);
  }

  update(value: T): boolean {
    const index = this.firstIndexFor(value);

    if (index === undefined) {
      return false;
    }

    this.siftUp(index);
    this.siftDown(index);
    return true;
  }

  remove(value: T): boolean {
    const index = this.firstIndexFor(value);

    if (index === undefined) {
      return false;
    }

    this.removeAt(index);
    return true;
  }

  clear(): void {
    this.heap = [];
    this.indexMap = new Map<T, Set<number>>();
  }

  private removeAt(index: number): T | undefined {
    if (index < 0 || index >= this.heap.length) {
      return undefined;
    }

    const lastIndex = this.heap.length - 1;
    this.swap(index, lastIndex);

    const removed = this.heap.pop();

    if (removed === undefined) {
      return undefined;
    }

    this.removeIndex(removed, lastIndex);

    if (index < this.heap.length) {
      this.siftUp(index);
      this.siftDown(index);
    }

    return removed;
  }

  private siftUp(index: number): void {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = this.parentIndex(currentIndex);

      if (this.compare(this.heap[currentIndex], this.heap[parentIndex]) >= 0) {
        break;
      }

      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }

  private siftDown(index: number): void {
    let currentIndex = index;

    while (true) {
      const left = this.leftIndex(currentIndex);
      const right = this.rightIndex(currentIndex);
      let smallest = currentIndex;

      if (left < this.heap.length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }

      if (right < this.heap.length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest === currentIndex) {
        break;
      }

      this.swap(currentIndex, smallest);
      currentIndex = smallest;
    }
  }

  private swap(first: number, second: number): void {
    if (first === second) {
      return;
    }

    const firstValue = this.heap[first];
    const secondValue = this.heap[second];

    this.heap[first] = secondValue;
    this.heap[second] = firstValue;

    this.removeIndex(firstValue, first);
    this.removeIndex(secondValue, second);
    this.addIndex(firstValue, second);
    this.addIndex(secondValue, first);
  }

  private parentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private leftIndex(index: number): number {
    return index * 2 + 1;
  }

  private rightIndex(index: number): number {
    return index * 2 + 2;
  }

  private addIndex(value: T, index: number): void {
    const indexes = this.indexMap.get(value) ?? new Set<number>();
    indexes.add(index);
    this.indexMap.set(value, indexes);
  }

  private removeIndex(value: T, index: number): void {
    const indexes = this.indexMap.get(value);

    if (!indexes) {
      return;
    }

    indexes.delete(index);

    if (indexes.size === 0) {
      this.indexMap.delete(value);
    }
  }

  private firstIndexFor(value: T): number | undefined {
    const indexes = this.indexMap.get(value);

    if (!indexes || indexes.size === 0) {
      return undefined;
    }

    return Math.min(...indexes);
  }
}
