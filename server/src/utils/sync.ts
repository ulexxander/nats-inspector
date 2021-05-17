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
