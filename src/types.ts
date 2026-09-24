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

/** One collage "shot": a block layout plus a distinct photo per cell — each
 * block shows a different image, cropped to its own bounds, not a shared
 * crop of one big image. Together they read as one scene. */
export type CollageScene = {
  id: string;
  cells: CellRect[];
  /** cellId -> image path under /public. */
  images: Record<string, string>;
  durationInFrames: number;
};
