import type {CellRect} from '../types';

// Distinct block partitions ("frames") the rapid-cut collage cycles through —
// each one a different tessellating layout, not a single grid reused with
// different content. Coordinates measured directly off gridded reference
// stills (percentage overlay, read by eye), not estimated.
//
// Several frames use a "spanning piece + inset" pattern: one piece covers a
// tall/wide region, and a smaller piece sits on top of part of it (drawn
// after it, so it paints over). Where the reference genuinely shows bare
// background between pieces (no piece there at all), that gap is kept
// faithfully rather than forced to tessellate.

// Frame 1 (ref still 6): 2 top / full-width strip bridging a real gap / 2 bottom.
export const frame1: CellRect[] = [
  {id: 'f1-tl', x: 0, y: 0, width: 36, height: 43},
  {id: 'f1-tr', x: 51, y: 0, width: 49, height: 43},
  {id: 'f1-mid', x: 0, y: 45, width: 95, height: 17},
  {id: 'f1-bl', x: 0, y: 64, width: 36, height: 36},
  {id: 'f1-br', x: 51, y: 66, width: 49, height: 34},
];

// Frame 2 (ref still 7): tall right column spans two row-heights; left side
// splits into its own rows/columns underneath. Tessellates with zero gaps.
export const frame2: CellRect[] = [
  {id: 'f2-tl', x: 0, y: 0, width: 52, height: 44},
  {id: 'f2-right', x: 52, y: 0, width: 48, height: 68},
  {id: 'f2-mid-l', x: 0, y: 44, width: 20, height: 24},
  {id: 'f2-mid-r', x: 20, y: 44, width: 32, height: 24},
  {id: 'f2-bl', x: 0, y: 68, width: 58, height: 32},
  {id: 'f2-br', x: 58, y: 68, width: 42, height: 32},
];

// Frame 3 (ref still 8): one big left piece, a top-right piece, a
// bottom-right piece that overlaps the big piece's corner (drawn after it).
export const frame3: CellRect[] = [
  {id: 'f3-big', x: 0, y: 0, width: 63, height: 88},
  {id: 'f3-tr', x: 63, y: 6, width: 37, height: 56},
  {id: 'f3-br', x: 48, y: 62, width: 52, height: 38},
];

// Frame 4 (ref still 9): two full-height columns, with a dark inset piece
// drawn over the bottom-left portion of the left column.
export const frame4: CellRect[] = [
  {id: 'f4-left', x: 0, y: 0, width: 50, height: 100},
  {id: 'f4-right', x: 50, y: 0, width: 50, height: 100},
  {id: 'f4-inset', x: 0, y: 58, width: 33, height: 42},
];

// Frame 5 (ref still 10): center bottle piece, full-height rooftop column,
// small pieces filling the bottom-left/bottom-middle. Bare paper shows in
// the top-left and bottom-left corners in the reference — kept as-is.
export const frame5: CellRect[] = [
  {id: 'f5-center', x: 15, y: 0, width: 59, height: 77},
  {id: 'f5-right', x: 76, y: 0, width: 24, height: 100},
  {id: 'f5-sliver', x: 0, y: 51, width: 15, height: 29},
  {id: 'f5-hand', x: 15, y: 79, width: 35, height: 21},
  {id: 'f5-bottom', x: 50, y: 79, width: 26, height: 21},
];

export const namedFrames = [
  {id: 'frame1', cells: frame1},
  {id: 'frame2', cells: frame2},
  {id: 'frame3', cells: frame3},
  {id: 'frame4', cells: frame4},
  {id: 'frame5', cells: frame5},
];
