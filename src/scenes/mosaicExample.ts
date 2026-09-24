import type {MosaicScene} from '../types';

// Placeholder scenes using flat colors instead of real photos, so this
// renders with zero external assets. Swap `color` for `src` (an image under
// /public) per scene to drop in real content — the same full image is what
// gets divided across the grid cells.
//
// With a 3x4 (12-cell) grid, revealDuration=66 spaces reveals ~6 frames
// apart — comfortably more than the 4-frame crossfade, so cells swap
// strictly one at a time instead of several firing together.
export const mosaicExampleScenes: MosaicScene[] = [
  {id: 'scene-1', color: '#6f97a3', durationInFrames: 90, revealDuration: 66, pattern: 'bottom-up'},
  {id: 'scene-2', color: '#c9beac', durationInFrames: 90, revealDuration: 66, pattern: 'bottom-up'},
  {id: 'scene-3', color: '#8a7d63', durationInFrames: 90, revealDuration: 66, pattern: 'bottom-up'},
  {id: 'scene-4', color: '#3f342a', durationInFrames: 90, revealDuration: 66, pattern: 'top-down'},
];
