export function errText(err: Error): string {
  if (err.name === "Error") {
    return err.message;
  }
  return `${err.name}(${err.message})`;
}

export function errTextWrap(err: Error, wrap: string): string {
  return `${wrap}: ${errText(err)})`;
}

export function errWrap(err: Error, message: string): Error {
  const text = errText(err);

  return new Error(`${message}: ${text}`);
}
