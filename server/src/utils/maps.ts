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

export class SoftMap<K, V> extends Map<K, V> {
  constructor(private readonly fallbackValue: V | (() => V)) {
    super();
  }

  getFallback(): V {
    if (typeof this.fallbackValue === "function") {
      return (this.fallbackValue as () => V)();
    }
    return this.fallbackValue;
  }

  get(key: K) {
    let val = super.get(key);
    if (!val) {
      val = this.getFallback();
      this.set(key, val);
    }
    return val;
  }
}
