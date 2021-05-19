export function truncate(text: string, maxLength: number) {
  if (text.length < maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + "...";
}
