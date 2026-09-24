import type {MosaicScene} from '../types';

// Placeholder scenes using flat colors instead of real photos, so this
// renders with zero external assets. Swap `color` for `src` (an image under
// /public) per scene to drop in real content — the same full image is what
// gets divided across the grid cells.
export const mosaicExampleScenes: MosaicScene[] = [
  {id: 'scene-1', color: '#6f97a3', durationInFrames: 45, revealDuration: 32, pattern: 'bottom-up'},
  {id: 'scene-2', color: '#c9beac', durationInFrames: 45, revealDuration: 32, pattern: 'bottom-up'},
  {id: 'scene-3', color: '#8a7d63', durationInFrames: 45, revealDuration: 32, pattern: 'bottom-up'},
  {id: 'scene-4', color: '#3f342a', durationInFrames: 50, revealDuration: 30, pattern: 'top-down'},
];
