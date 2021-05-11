export function mmap<K, V, R>(
  map: Map<K, V>,
  func: (key: K, val: V) => R,
): R[] {
  const result: R[] = [];
  for (const [key, val] of map) {
    result.push(func(key, val));
  }
  return result;
}

export function batch<R>() {
  const promises: Promise<R>[] = [];

  return {
    add(...promise: Promise<R>[]) {
      promises.push(...promise);
    },
    wait() {
      return Promise.all(promises);
    },
  };
}
