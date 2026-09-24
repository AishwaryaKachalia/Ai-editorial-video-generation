import type {CollageScene} from '../types';
import {frame1, frame2, frame3, frame4} from '../grids/frames';

export const collageScenes: CollageScene[] = [
  {id: 'scene-1', cells: frame1, src: 'images/scene-paper-toss.jpg', durationInFrames: 65, word: 'Trousers'},
  {id: 'scene-2', cells: frame2, src: 'images/scene-binders.jpg', durationInFrames: 65, word: 'that'},
  {id: 'scene-3', cells: frame3, src: 'images/scene-stickynotes.jpg', durationInFrames: 65, word: 'mean'},
  {id: 'scene-4', cells: frame4, src: 'images/scene-product-detail.jpg', durationInFrames: 65, word: 'charm'},
];
