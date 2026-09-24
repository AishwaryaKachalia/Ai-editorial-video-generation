// FNV-1a: adjacent seeds like "tilt-0-0" / "tilt-0-1" need to land far apart,
// which a simple polynomial hash doesn't guarantee (its low bits stay
// correlated for near-identical inputs, which showed up as every grid cell
// tilting the same direction).
const hashString = (seed: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

// Deterministic pseudo-random offset so repeated renders are frame-identical.
export const seededJitter = (seed: string, range: number): number => {
  const hash = hashString(seed);
  return ((hash % 1000) / 1000 - 0.5) * 2 * range;
};

export const seededPick = <T,>(seed: string, options: readonly T[]): T => {
  const hash = hashString(seed);
  return options[hash % options.length];
};
