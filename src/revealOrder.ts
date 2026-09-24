import type {CellRect, RevealPattern} from './types';
import {seededJitter} from './jitter';

const primaryKey = (cell: CellRect, pattern: RevealPattern): number => {
  switch (pattern) {
    case 'bottom-up':
      return -cell.y;
    case 'top-down':
    case 'reading-order':
      return cell.y;
    case 'left-right':
      return cell.x;
    case 'right-left':
      return -cell.x;
    case 'diagonal':
      return cell.x + cell.y;
    case 'random':
      return 0;
    default:
      return -cell.y;
  }
};

// One-by-one reveal order: cells are ranked so exactly one swaps at a time.
// `reading-order` is strictly row-major (left-to-right, top-to-bottom) —
// everything else is biased toward `pattern`'s direction but with a
// randomized tiebreak within each rank tier so it doesn't look mechanical.
export const buildRevealRanks = (cells: CellRect[], pattern: RevealPattern, seed: string): Map<string, number> => {
  const withKeys = cells.map((cell) => ({
    id: cell.id,
    key: primaryKey(cell, pattern),
    tiebreak: pattern === 'reading-order' ? cell.x : seededJitter(`${seed}-order-${cell.id}`, 1),
  }));

  withKeys.sort((a, b) => a.key - b.key || a.tiebreak - b.tiebreak);

  const ranks = new Map<string, number>();
  withKeys.forEach(({id}, index) => {
    ranks.set(id, index);
  });
  return ranks;
};

// Small, fixed per-cell timing offset so consecutive reveals don't land on a
// perfectly even beat.
export const cellTimingJitter = (cellId: string, sceneId: string): number =>
  seededJitter(`${sceneId}-timing-${cellId}`, 1.5);

// Fixed per-cell tilt (grid position never moves — only its tiny rotation
// does), like a physical tile that was placed by hand, not machine-aligned.
export const cellTilt = (cellId: string, maxDegrees = 2.2): number => seededJitter(`tilt-${cellId}`, maxDegrees);
