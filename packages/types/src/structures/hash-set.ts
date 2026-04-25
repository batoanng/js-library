import { HashTable } from './hash-table';

export class HashSet<T> {
  private table = new HashTable<T, true>();

  get size(): number {
    return this.table.size;
  }

  add(value: T): boolean {
    if (this.table.has(value)) {
      return false;
    }

    this.table.put(value, true);
    return true;
  }

  has(value: T): boolean {
    return this.table.has(value);
  }

  delete(value: T): boolean {
    return this.table.remove(value);
  }

  clear(): void {
    this.table.clear();
  }
}
