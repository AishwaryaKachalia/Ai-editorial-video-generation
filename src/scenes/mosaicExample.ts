import type {MosaicScene} from '../types';

// With a 3x4 (12-cell) grid, revealDuration=66 spaces reveals ~6 frames
// apart — comfortably more than the 4-frame crossfade, so cells swap
// strictly one at a time instead of several firing together.
export const mosaicExampleScenes: MosaicScene[] = [
  {id: 'black-sleeveless', src: 'images/black-sleeveless.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
  {id: 'white-blouse-black-pants', src: 'images/white-blouse-black-pants.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
  {id: 'sleeveless-white-top', src: 'images/sleeveless-white-top.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
  {id: 'logo', src: 'images/logo.jpg', durationInFrames: 90, revealDuration: 66, pattern: 'reading-order'},
];
