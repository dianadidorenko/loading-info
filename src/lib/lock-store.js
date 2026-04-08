// src/lib/lock-store.js
export const LOCK_TIMEOUT = 300000; // 5 минут

const getSafeStorage = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  const saved = localStorage.getItem(key);
  if (saved === null) return fallback;
  // Если это число (время), возвращаем число, иначе булево
  const val = localStorage.getItem(key);
  return val === "true" ? true : val === "false" ? false : Number(val);
};

export const lockState = {
  isLocked: getSafeStorage("isLocked", true),
  lastUnlockTime: getSafeStorage("lastUnlockTime", 0),
  listeners: new Set(),

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },

  setLocked(val) {
    this.isLocked = val;
    if (typeof window !== "undefined") {
      localStorage.setItem("isLocked", val);
      if (!val) {
        this.lastUnlockTime = Date.now();
        localStorage.setItem("lastUnlockTime", this.lastUnlockTime);
      }
    }
    this.listeners.forEach((fn) => fn(val));
  },
};
