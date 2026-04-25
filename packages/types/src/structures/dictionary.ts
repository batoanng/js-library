export class Dictionary<K, V> {
  private table = new Map<K, V>();

  get size(): number {
    return this.table.size;
  }

  set(key: K, value: V): void {
    this.table.set(key, value);
  }

  get(key: K): V | undefined {
    return this.table.get(key);
  }

  has(key: K): boolean {
    return this.table.has(key);
  }

  delete(key: K): boolean {
    return this.table.delete(key);
  }

  clear(): void {
    this.table = new Map<K, V>();
  }

  keys(): K[] {
    return [...this.table.keys()];
  }

  values(): V[] {
    return [...this.table.values()];
  }

  entries(): Array<[K, V]> {
    return [...this.table.entries()];
  }

  forEach(callback: (key: K, value: V) => void): void {
    for (const [key, value] of this.table.entries()) {
      callback(key, value);
    }
  }
}
