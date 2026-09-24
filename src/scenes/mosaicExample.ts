import type {MosaicScene} from '../types';

// The irregular collage grid has 13 cells; revealDuration=78 spaces reveals
// 6.5 frames apart — comfortably more than the 4-frame crossfade, so cells
// swap strictly one at a time instead of several firing together.
export const mosaicExampleScenes: MosaicScene[] = [
  {id: 'black-sleeveless', src: 'images/black-sleeveless.jpg', durationInFrames: 102, revealDuration: 78, pattern: 'reading-order'},
  {id: 'white-blouse-black-pants', src: 'images/white-blouse-black-pants.jpg', durationInFrames: 102, revealDuration: 78, pattern: 'reading-order'},
  {id: 'sleeveless-white-top', src: 'images/sleeveless-white-top.jpg', durationInFrames: 102, revealDuration: 78, pattern: 'reading-order'},
  {id: 'logo', src: 'images/logo.jpg', durationInFrames: 102, revealDuration: 78, pattern: 'reading-order'},
];
