import type {MosaicScene} from '../types';

// With a 3x4 (12-cell) grid, revealDuration=66 spaces reveals ~6 frames
// apart — comfortably more than the 4-frame crossfade, so cells swap
// strictly one at a time instead of several firing together.
export const mosaicExampleScenes: MosaicScene[] = [
  {id: 'wrap-1', src: 'images/wrap-beige-1.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
  {id: 'wrap-2', src: 'images/wrap-beige-2.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
  {id: 'wrap-3', src: 'images/wrap-beige-3.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
  {id: 'look-1', src: 'images/look-1.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
  {id: 'look-2', src: 'images/look-2.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
  {id: 'look-3', src: 'images/look-3.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
  {id: 'look-4', src: 'images/look-4.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
];
