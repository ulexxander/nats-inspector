export function env(key: string, fallback?: string) {
  const val = process.env[key];
  if (val) {
    return val;
  }

  if (fallback) {
    return fallback;
  }

  throw new Error(`Mandatory env variable ${key} is missing`);
}
