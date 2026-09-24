// Deterministic pseudo-random offset so repeated renders are frame-identical.
export const seededJitter = (seed: string, range: number): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return ((hash % 1000) / 1000 - 0.5) * 2 * range;
};
