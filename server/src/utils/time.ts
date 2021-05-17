export function isoTimestamp(date?: Date) {
  return date ? date.toISOString() : new Date().toISOString();
}
