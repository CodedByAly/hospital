/** localStorage helpers that never throw (private mode, blocked storage, SSR). */
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — state simply won't persist */
    }
  },
}
