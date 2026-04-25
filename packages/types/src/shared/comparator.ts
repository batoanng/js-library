export type Comparator<T> = (a: T, b: T) => number;

export function defaultComparator<T>(a: T, b: T): number {
  if (Object.is(a, b)) {
    return 0;
  }

  if (a == null || b == null) {
    return a == null ? -1 : 1;
  }

  const typeA = typeof a;
  const typeB = typeof b;

  if (typeA !== typeB) {
    return String(typeA).localeCompare(String(typeB));
  }

  if (typeA === 'number') {
    return (a as number) < (b as number) ? -1 : 1;
  }

  if (typeA === 'bigint') {
    return (a as bigint) < (b as bigint) ? -1 : 1;
  }

  if (typeA === 'string') {
    return (a as string).localeCompare(b as string);
  }

  if (typeA === 'boolean') {
    return Number(a) - Number(b);
  }

  if (typeA === 'symbol') {
    return String(a).localeCompare(String(b));
  }

  throw new TypeError('A custom comparator is required for non-primitive values.');
}
