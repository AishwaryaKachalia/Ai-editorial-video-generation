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
