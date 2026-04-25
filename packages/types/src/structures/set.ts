export class MySet<T> {
  private items = new Map<T, true>();

  get size(): number {
    return this.items.size;
  }

  add(value: T): boolean {
    if (this.items.has(value)) {
      return false;
    }

    this.items.set(value, true);
    return true;
  }

  has(value: T): boolean {
    return this.items.has(value);
  }

  delete(value: T): boolean {
    return this.items.delete(value);
  }

  clear(): void {
    this.items = new Map<T, true>();
  }

  values(): T[] {
    return [...this.items.keys()];
  }

  union(other: MySet<T>): MySet<T> {
    const result = new MySet<T>();

    for (const value of this.items.keys()) {
      result.add(value);
    }

    for (const value of other.items.keys()) {
      result.add(value);
    }

    return result;
  }

  intersection(other: MySet<T>): MySet<T> {
    const result = new MySet<T>();
    const [smaller, larger] = this.size <= other.size ? [this, other] : [other, this];

    for (const value of smaller.items.keys()) {
      if (larger.has(value)) {
        result.add(value);
      }
    }

    return result;
  }

  difference(other: MySet<T>): MySet<T> {
    const result = new MySet<T>();

    for (const value of this.items.keys()) {
      if (!other.has(value)) {
        result.add(value);
      }
    }

    return result;
  }

  isSubsetOf(other: MySet<T>): boolean {
    for (const value of this.items.keys()) {
      if (!other.has(value)) {
        return false;
      }
    }

    return true;
  }
}
