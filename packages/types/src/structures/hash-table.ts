import { hashValue, normalizeBucketIndex, polynomialHash } from '../shared';

type HashEntry<K, V> = {
  key: K;
  value: V;
  hashKey: string;
};

export class HashTable<K, V> {
  private buckets: Array<Array<HashEntry<K, V>>>;
  private count = 0;
  private capacity = 16;
  private readonly maxLoadFactor = 0.75;

  constructor() {
    this.buckets = this.createBuckets(this.capacity);
  }

  get size(): number {
    return this.count;
  }

  put(key: K, value: V): void {
    this.upsert(key, value, true);
  }

  get(key: K): V | undefined {
    const entry = this.findEntry(key);
    return entry?.value;
  }

  has(key: K): boolean {
    return this.findEntry(key) !== undefined;
  }

  remove(key: K): boolean {
    const hashKey = hashValue(key);
    const bucket = this.bucketForHashKey(hashKey);
    const index = bucket.findIndex((entry) => entry.hashKey === hashKey);

    if (index === -1) {
      return false;
    }

    bucket.splice(index, 1);
    this.count -= 1;
    return true;
  }

  clear(): void {
    this.capacity = 16;
    this.count = 0;
    this.buckets = this.createBuckets(this.capacity);
  }

  private findEntry(key: K): HashEntry<K, V> | undefined {
    const hashKey = hashValue(key);
    return this.bucketForHashKey(hashKey).find((entry) => entry.hashKey === hashKey);
  }

  private upsert(key: K, value: V, allowResize: boolean): void {
    const hashKey = hashValue(key);
    const bucket = this.bucketForHashKey(hashKey);
    const existingEntry = bucket.find((entry) => entry.hashKey === hashKey);

    if (existingEntry) {
      existingEntry.value = value;
      existingEntry.key = key;
      return;
    }

    bucket.push({ key, value, hashKey });
    this.count += 1;

    if (allowResize && this.count / this.capacity > this.maxLoadFactor) {
      this.resize(this.capacity * 2);
    }
  }

  private resize(nextCapacity: number): void {
    const entries = this.buckets.flat();

    this.capacity = nextCapacity;
    this.count = 0;
    this.buckets = this.createBuckets(this.capacity);

    for (const entry of entries) {
      this.upsert(entry.key, entry.value, false);
    }
  }

  private bucketForHashKey(hashKey: string): Array<HashEntry<K, V>> {
    const bucketIndex = normalizeBucketIndex(polynomialHash(hashKey), this.capacity);
    return this.buckets[bucketIndex];
  }

  private createBuckets(capacity: number): Array<Array<HashEntry<K, V>>> {
    return Array.from({ length: capacity }, () => []);
  }
}
