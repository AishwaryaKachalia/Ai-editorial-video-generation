import type {Scene} from '../types';

// Placeholder scene using tinted paper-texture cards instead of real images,
// so it renders with zero external assets. Swap `color` for `src` (a file
// under /public) per tile to drop in an actual photo.
export const exampleScenes: Scene[] = [
  {
    id: 'scene-1',
    durationInFrames: 90,
    background: '#f5f3ef',
    tiles: [
      {id: 's1-a', x: 35, y: 30, width: 45, height: 30, rotation: -4, startFrame: 0, duration: 18, color: '#d8c9b8'},
      {id: 's1-b', x: 65, y: 30, width: 45, height: 30, rotation: 3, startFrame: 6, duration: 18, color: '#c2a98f', shine: true},
      {id: 's1-c', x: 35, y: 62, width: 45, height: 30, rotation: 2, startFrame: 12, duration: 18, color: '#8f7a63'},
      {id: 's1-d', x: 65, y: 62, width: 45, height: 30, rotation: -3, startFrame: 18, duration: 18, color: '#3f342a'},
    ],
  },
  {
    id: 'scene-2',
    durationInFrames: 90,
    background: '#ece7de',
    tiles: [
      {id: 's2-a', x: 50, y: 40, width: 60, height: 40, rotation: -2, startFrame: 0, duration: 20, color: '#b5c4bb', shine: true},
      {id: 's2-b', x: 30, y: 75, width: 40, height: 28, rotation: 5, startFrame: 10, duration: 20, color: '#7f9a8b'},
      {id: 's2-c', x: 72, y: 78, width: 40, height: 28, rotation: -5, startFrame: 16, duration: 20, color: '#41564c'},
    ],
  },
];
