import type {CellRect} from '../types';

// Distinct block partitions ("frames") the rapid-cut collage cycles through —
// each one a different tessellating layout, not a single grid reused with
// different content. Modeled on 5 stills from the reference reel.

// Frame 1: 2 cols / thin strip / 2 cols (5 blocks).
export const frame1: CellRect[] = [
  {id: 'f1-a1', x: 0, y: 0, width: 48, height: 42},
  {id: 'f1-a2', x: 52, y: 0, width: 48, height: 42},
  {id: 'f1-b1', x: 0, y: 44, width: 96, height: 16},
  {id: 'f1-c1', x: 0, y: 62, width: 48, height: 38},
  {id: 'f1-c2', x: 52, y: 62, width: 48, height: 38},
];

// Frame 2: uneven 2 / 3 / 2 row grid (7 blocks).
export const frame2: CellRect[] = [
  {id: 'f2-a1', x: 0, y: 0, width: 54, height: 44},
  {id: 'f2-a2', x: 58, y: 0, width: 42, height: 44},
  {id: 'f2-b1', x: 0, y: 46, width: 54, height: 24},
  {id: 'f2-b2', x: 56, y: 46, width: 22, height: 24},
  {id: 'f2-b3', x: 80, y: 46, width: 20, height: 24},
  {id: 'f2-c1', x: 0, y: 72, width: 58, height: 28},
  {id: 'f2-c2', x: 60, y: 72, width: 40, height: 28},
];

// Frame 3: staggered vertical strips, varied widths/heights (4 blocks).
export const frame3: CellRect[] = [
  {id: 'f3-1', x: 0, y: 0, width: 25, height: 100},
  {id: 'f3-2', x: 27, y: 8, width: 23, height: 84},
  {id: 'f3-3', x: 52, y: 0, width: 21, height: 70},
  {id: 'f3-4', x: 75, y: 14, width: 25, height: 86},
];

// Frame 4: irregular 2x2 quadrants (4 blocks).
export const frame4: CellRect[] = [
  {id: 'f4-tl', x: 0, y: 0, width: 49, height: 52},
  {id: 'f4-tr', x: 51, y: 0, width: 49, height: 52},
  {id: 'f4-bl', x: 0, y: 54, width: 37, height: 46},
  {id: 'f4-br', x: 39, y: 54, width: 61, height: 46},
];

// Frame 5: one dominant block + rooftop sliver + thin bottom row (5 blocks).
export const frame5: CellRect[] = [
  {id: 'f5-a1', x: 0, y: 0, width: 74, height: 58},
  {id: 'f5-a2', x: 76, y: 0, width: 24, height: 50},
  {id: 'f5-b1', x: 0, y: 60, width: 12, height: 40},
  {id: 'f5-b2', x: 14, y: 60, width: 36, height: 40},
  {id: 'f5-b3', x: 52, y: 60, width: 48, height: 40},
];

export const namedFrames = [
  {id: 'frame1', cells: frame1},
  {id: 'frame2', cells: frame2},
  {id: 'frame3', cells: frame3},
  {id: 'frame4', cells: frame4},
  {id: 'frame5', cells: frame5},
];
