export function errText(error?: Error | string | null) {
  if (!error) {
    return "";
  }
  return typeof error === "string" ? error : error.message;
}
