export function mmap<K, V, R>(
  map: Map<K, V>,
  func: (key: K, val: V) => R
): R[] {
  const result: R[] = [];
  for (const [key, val] of map) {
    result.push(func(key, val));
  }
  return result;
}
