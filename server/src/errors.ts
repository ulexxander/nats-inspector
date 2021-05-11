export function errtext(err: Error): string {
  return `${err.name}(${err.message})`;
}

export function wrap(err: Error, message: string): string {
  const text = errtext(err);

  return `${message}: ${text}`;
}
