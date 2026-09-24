export type MosaicScene = {
  id: string;
  /** Path under /public, or omit for a flat placeholder color. */
  src?: string;
  color?: string;
  /** How long this scene holds before the next scene's fragments fly in. */
  durationInFrames: number;
};

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

export type MosaicGrid = {
  cells: CellRect[];
  /** Grout gap between cells, in pixels, showing the background beneath. */
  gapPx?: number;
};
