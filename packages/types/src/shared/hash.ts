function stableSerialize(value: unknown, seen: WeakSet<object>): string {
  if (value === null) {
    return 'null';
  }

  const valueType = typeof value;

  switch (valueType) {
    case 'undefined':
      return 'undefined';
    case 'boolean':
      return `boolean:${value ? 'true' : 'false'}`;
    case 'number':
      if (Number.isNaN(value)) {
        return 'number:NaN';
      }

      if (Object.is(value, -0)) {
        return 'number:-0';
      }

      return `number:${value}`;
    case 'bigint':
      return `bigint:${String(value)}`;
    case 'string':
      return `string:${JSON.stringify(value)}`;
    case 'symbol':
      return `symbol:${String(value)}`;
    case 'function':
      return `function:${(value as { name?: string }).name || 'anonymous'}`;
    case 'object':
      break;
    default:
      return `${valueType}:${String(value)}`;
  }

  if (value instanceof Date) {
    return `date:${value.toISOString()}`;
  }

  if (Array.isArray(value)) {
    return `array:[${value.map((item) => stableSerialize(item, seen)).join(',')}]`;
  }

  const objectValue = value as Record<string, unknown>;

  if (seen.has(objectValue)) {
    throw new TypeError('Circular structures are not supported by the hash helpers.');
  }

  seen.add(objectValue);

  const entries = Object.keys(objectValue)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(objectValue[key], seen)}`);

  seen.delete(objectValue);

  return `object:{${entries.join(',')}}`;
}

export function stableStringify(value: unknown): string {
  return stableSerialize(value, new WeakSet<object>());
}

export function polynomialHash(input: string): number {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(hash, 31) + input.charCodeAt(index);
    hash |= 0;
  }

  return hash;
}

export function normalizeBucketIndex(hash: number, capacity: number): number {
  return ((hash % capacity) + capacity) % capacity;
}

export function hashValue(value: unknown): string {
  return stableStringify(value);
}
