export type RevealPattern =
  | 'bottom-up'
  | 'top-down'
  | 'left-right'
  | 'right-left'
  | 'diagonal'
  | 'random'
  | 'reading-order';

export type MosaicScene = {
  id: string;
  /** Path under /public, or omit for a flat placeholder color. */
  src?: string;
  color?: string;
  /** How long this scene owns the grid before the next scene starts revealing. */
  durationInFrames: number;
  /** How many frames the cell-by-cell cascade takes to cover the whole grid. */
  revealDuration: number;
  pattern?: RevealPattern;
};

/** A single grid cell, as a percentage rect (0-100) of the canvas. Cells can
 * vary in size — a tessellating irregular layout, not just a uniform grid. */
export type CellRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MosaicGrid = {
  cells: CellRect[];
  /** Grout gap between cells, in pixels, showing the background beneath. */
  gapPx?: number;
};
