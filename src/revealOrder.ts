import type {RevealPattern} from './types';
import {seededJitter} from './jitter';

// Returns 0..1: how far through the cascade this cell reveals, before jitter.
export const revealFraction = (
  row: number,
  col: number,
  rows: number,
  columns: number,
  pattern: RevealPattern,
): number => {
  const rowFrac = rows <= 1 ? 0 : row / (rows - 1);
  const colFrac = columns <= 1 ? 0 : col / (columns - 1);

  switch (pattern) {
    case 'bottom-up':
      return 1 - rowFrac;
    case 'top-down':
      return rowFrac;
    case 'left-right':
      return colFrac;
    case 'right-left':
      return 1 - colFrac;
    case 'diagonal':
      return (rowFrac + colFrac) / 2;
    case 'random':
      return (seededJitter(`${row}-${col}`, 1) + 1) / 2;
    default:
      return 1 - rowFrac;
  }
};

// Adds organic per-cell timing noise on top of the base sweep direction, so
// the cascade doesn't look like a mechanical linear wipe.
export const cellJitterFrames = (row: number, col: number, sceneId: string, spread: number): number =>
  seededJitter(`${sceneId}-${row}-${col}`, spread);
