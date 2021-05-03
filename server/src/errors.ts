export function wrap(err: Error, message: string) {
  if (err.message) {
    return `${message}: ${err.message}`;
  }

  if (err.name) {
    return `${message}: ${err.name}`;
  }

  return `${message}: Unknown error`;
}
