import type {RevealPattern} from './types';
import {seededJitter} from './jitter';

type Cell = {row: number; col: number};

const primaryKey = (row: number, col: number, pattern: RevealPattern): number => {
  switch (pattern) {
    case 'bottom-up':
      return -row;
    case 'top-down':
    case 'reading-order':
      return row;
    case 'left-right':
      return col;
    case 'right-left':
      return -col;
    case 'diagonal':
      return row + col;
    case 'random':
      return 0;
    default:
      return -row;
  }
};

// One-by-one reveal order: cells are ranked so exactly one swaps at a time.
// `reading-order` is strictly row-major (left-to-right, top-to-bottom) —
// everything else is biased toward `pattern`'s direction but with a
// randomized tiebreak within each rank tier so it doesn't look mechanical.
export const buildRevealRanks = (
  rows: number,
  columns: number,
  pattern: RevealPattern,
  seed: string,
): Map<string, number> => {
  const cells: Cell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      cells.push({row, col});
    }
  }

  const withKeys = cells.map(({row, col}) => ({
    row,
    col,
    key: primaryKey(row, col, pattern),
    tiebreak: pattern === 'reading-order' ? col : seededJitter(`${seed}-order-${row}-${col}`, 1),
  }));

  withKeys.sort((a, b) => a.key - b.key || a.tiebreak - b.tiebreak);

  const ranks = new Map<string, number>();
  withKeys.forEach(({row, col}, index) => {
    ranks.set(`${row}-${col}`, index);
  });
  return ranks;
};

// Small, fixed per-cell timing offset so consecutive reveals don't land on a
// perfectly even beat.
export const cellTimingJitter = (row: number, col: number, sceneId: string): number =>
  seededJitter(`${sceneId}-timing-${row}-${col}`, 1.5);

// Fixed per-cell tilt (grid position never moves — only its tiny rotation
// does), like a physical tile that was placed by hand, not machine-aligned.
export const cellTilt = (row: number, col: number, maxDegrees = 2.2): number =>
  seededJitter(`tilt-${row}-${col}`, maxDegrees);
