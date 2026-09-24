export type RevealPattern = 'bottom-up' | 'top-down' | 'left-right' | 'right-left' | 'diagonal' | 'random';

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
  /** Grout gap between cells, in pixels, showing the paper texture beneath. */
  gapPx?: number;
};
