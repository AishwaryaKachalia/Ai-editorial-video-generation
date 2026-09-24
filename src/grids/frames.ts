import type {CellRect} from '../types';

// Distinct block partitions ("frames") the rapid-cut collage cycles through —
// each one a different tessellating layout, not a single grid reused with
// different content. Every layout fully tiles the canvas: zero gaps, no
// exposed background anywhere, in the settled state as well as mid-motion.

// Frame 1: 2 cols / full-width strip / 2 cols.
export const frame1: CellRect[] = [
  {id: 'f1-tl', x: 0, y: 0, width: 50, height: 42},
  {id: 'f1-tr', x: 50, y: 0, width: 50, height: 42},
  {id: 'f1-mid', x: 0, y: 42, width: 100, height: 18},
  {id: 'f1-bl', x: 0, y: 60, width: 50, height: 40},
  {id: 'f1-br', x: 50, y: 60, width: 50, height: 40},
];

// Frame 2: tall right column spans two row-heights; left side splits into
// its own rows/columns underneath.
export const frame2: CellRect[] = [
  {id: 'f2-tl', x: 0, y: 0, width: 52, height: 44},
  {id: 'f2-right', x: 52, y: 0, width: 48, height: 68},
  {id: 'f2-mid-l', x: 0, y: 44, width: 20, height: 24},
  {id: 'f2-mid-r', x: 20, y: 44, width: 32, height: 24},
  {id: 'f2-bl', x: 0, y: 68, width: 58, height: 32},
  {id: 'f2-br', x: 58, y: 68, width: 42, height: 32},
];

// Frame 3: one big left piece, a top-right piece, a bottom-right piece that
// overlaps the big piece's corner (drawn after it, so it paints over).
export const frame3: CellRect[] = [
  {id: 'f3-big', x: 0, y: 0, width: 63, height: 100},
  {id: 'f3-tr', x: 63, y: 0, width: 37, height: 62},
  {id: 'f3-br', x: 48, y: 62, width: 52, height: 38},
];

// Frame 4: two full-height columns, with a dark inset piece drawn over the
// bottom-left portion of the left column.
export const frame4: CellRect[] = [
  {id: 'f4-left', x: 0, y: 0, width: 50, height: 100},
  {id: 'f4-right', x: 50, y: 0, width: 50, height: 100},
  {id: 'f4-inset', x: 0, y: 58, width: 33, height: 42},
];

// Frame 5: full-height left and right strips, a center piece, small pieces
// filling the bottom-middle.
export const frame5: CellRect[] = [
  {id: 'f5-sliver', x: 0, y: 0, width: 15, height: 100},
  {id: 'f5-center', x: 15, y: 0, width: 61, height: 77},
  {id: 'f5-right', x: 76, y: 0, width: 24, height: 100},
  {id: 'f5-hand', x: 15, y: 77, width: 35, height: 23},
  {id: 'f5-bottom', x: 50, y: 77, width: 26, height: 23},
];

export const namedFrames = [
  {id: 'frame1', cells: frame1},
  {id: 'frame2', cells: frame2},
  {id: 'frame3', cells: frame3},
  {id: 'frame4', cells: frame4},
  {id: 'frame5', cells: frame5},
];
