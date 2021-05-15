export function errtext(err: Error, wrap?: string): string {
  if (wrap) {
    return `${wrap}: ${err.name}(${err.message})`;
  }
  return `${err.name}(${err.message})`;
}

export function errwrap(err: Error, message: string): Error {
  const text = errtext(err);

  return new Error(`${message}: ${text}`);
}
