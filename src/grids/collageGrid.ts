import type {CellRect} from '../types';

// An irregular, tessellating layout — mixed large panels and thin strip
// accents, echoing the reference reel's torn-paper-fragment look instead of
// a uniform NxM grid. Rows stack with varying heights; each row splits into
// columns of varying widths. All values are percentages of the canvas and
// tile exactly (no gaps/overlaps before the grout inset is applied).
export const collageGridCells: CellRect[] = [
  // Row A: 0-24%
  {id: 'a1', x: 0, y: 0, width: 35, height: 24},
  {id: 'a2', x: 35, y: 0, width: 30, height: 24},
  {id: 'a3', x: 65, y: 0, width: 35, height: 24},
  // Row B (thin strip): 24-30%
  {id: 'b1', x: 0, y: 24, width: 60, height: 6},
  {id: 'b2', x: 60, y: 24, width: 40, height: 6},
  // Row C: 30-62%
  {id: 'c1', x: 0, y: 30, width: 45, height: 32},
  {id: 'c2', x: 45, y: 30, width: 55, height: 32},
  // Row D (thin strip): 62-68%
  {id: 'd1', x: 0, y: 62, width: 30, height: 6},
  {id: 'd2', x: 30, y: 62, width: 40, height: 6},
  {id: 'd3', x: 70, y: 62, width: 30, height: 6},
  // Row E: 68-100%
  {id: 'e1', x: 0, y: 68, width: 33, height: 32},
  {id: 'e2', x: 33, y: 68, width: 34, height: 32},
  {id: 'e3', x: 67, y: 68, width: 33, height: 32},
];
