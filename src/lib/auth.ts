/** Demo-safe sync password hash (localStorage auth). Not for production crypto. */
export function hashPassword(password: string) {
  const s = `elit-detailing-v1:${password}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `ed1_${(h >>> 0).toString(16)}`;
}

export function verifyPassword(password: string, hash?: string) {
  if (!hash) return false;
  return hashPassword(password) === hash;
}

export function makeResetToken() {
  const a = Math.random().toString(36).slice(2);
  const b = Date.now().toString(36);
  return `${b}${a}${Math.random().toString(36).slice(2)}`;
}

export const DEMO_CUSTOMER_PASSWORD = "123456";
