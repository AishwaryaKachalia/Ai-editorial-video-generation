/** A single grid cell, as a percentage rect (0-100) of the canvas — this is
 * the cell's resting position. Cells can vary in size — a tessellating
 * irregular layout, not just a uniform grid. */
export type CellRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

/** One collage "shot": a block layout, all cells cropping the same shared
 * image (each cell shows the matching portion, like puzzle pieces of one
 * photo) rather than each cell holding its own distinct photo. */
export type CollageScene = {
  id: string;
  cells: CellRect[];
  /** Path under /public — the one image this scene's cells all crop from. */
  src: string;
  durationInFrames: number;
  /** One word shown once the puzzle assembles, e.g. one word per scene
   * across a video spells out a phrase. */
  word?: string;
};

// --- MosaicReveal (uniform-grid, one-cell-at-a-time reveal) ---

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

export type MosaicGrid = {
  columns: number;
  rows: number;
  /** Grout gap between cells, in pixels, showing the background beneath. */
  gapPx?: number;
};
