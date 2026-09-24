import type {CollageScene} from '../types';
import {frame1} from '../grids/frames';

export const collageScenes: CollageScene[] = [
  {
    id: 'scene-1',
    cells: frame1,
    durationInFrames: 90,
    images: {
      'f1-tl': 'images/frame1/doorway-blue-shirt.jpg',
      'f1-tr': 'images/frame1/doorway-black-halter.jpg',
      'f1-mid': 'images/frame1/concrete-black-top.jpg',
      'f1-bl': 'images/frame1/cream-vest-crop.jpg',
      'f1-br': 'images/frame1/black-turtleneck-crop.jpg',
    },
  },
];
