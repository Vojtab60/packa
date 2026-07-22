export function loadJson<T>(key: string, fallback: T, guard?: (value: unknown) => value is T): T {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);
    return guard && !guard(parsed) ? fallback : parsed as T;
  } catch {
    return fallback;
  }
}

export function storeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function copyStoredValueIfMissing(fromKey: string, toKey: string) {
  try {
    const existing = window.localStorage.getItem(toKey);
    const oldValue = window.localStorage.getItem(fromKey);
    if (!existing && oldValue) {
      window.localStorage.setItem(toKey, oldValue);
    }
  } catch {
    // Best-effort migration only.
  }
}
