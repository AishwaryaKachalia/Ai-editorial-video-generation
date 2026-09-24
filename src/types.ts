export type Tile = {
  /** Unique-ish key; also used to seed deterministic jitter for the default fly-in direction. */
  id: string;
  /** Path relative to /public, e.g. "images/bottle.jpg". Omit to render a flat color placeholder. */
  src?: string;
  type?: 'image' | 'video';
  /** Center position, percentage of canvas width/height (0-100). */
  x: number;
  y: number;
  /** Size, percentage of canvas width/height (0-100). */
  width: number;
  height: number;
  /** Final resting rotation in degrees. */
  rotation?: number;
  /** Frame (relative to the scene start) this tile begins flying in. */
  startFrame: number;
  /** How many frames the fly-in animation takes. */
  duration?: number;
  zIndex?: number;
  color?: string;
  /** Override the fly-in start position/rotation; defaults are derived deterministically from `id`. */
  fromX?: number;
  fromY?: number;
  fromRotation?: number;
};

export type Scene = {
  id: string;
  durationInFrames: number;
  background?: string;
  tiles: Tile[];
};
