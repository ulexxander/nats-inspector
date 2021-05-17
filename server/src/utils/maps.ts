export function mapTransform<K, V, R>(
  map: Map<K, V>,
  func: (key: K, val: V) => R,
): R[] {
  const result: R[] = [];
  for (const [key, val] of map) {
    result.push(func(key, val));
  }
  return result;
}

export function mapKeys<K, V>(map: Map<K, V>): K[] {
  return [...map.keys()];
}

export function mapValues<K, V>(map: Map<K, V>): V[] {
  return [...map.values()];
}
