export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => {
  const d = v.replace(/[\s()-]/g, "");
  return /^\+?\d{8,15}$/.test(d);
};
export const makeRef = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
