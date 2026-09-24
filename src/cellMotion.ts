import {seededJitter} from './jitter';

// Fixed per-cell resting tilt — a physical tile placed by hand, not
// machine-aligned. Keyed only by cell id, so it never changes between
// scenes (the same slot always settles at the same small angle).
export const cellTilt = (cellId: string, maxDegrees = 2.2): number => seededJitter(`tilt-${cellId}`, maxDegrees);

// How many frames into the scene this cell's fly-in begins, spread across a
// short window so many fragments are in motion at once (chaotic, not
// one-at-a-time). Re-seeded per scene, so each scene's scatter differs.
export const cellFlightDelay = (cellId: string, sceneId: string, windowFrames: number): number =>
  ((seededJitter(`${sceneId}-delay-${cellId}`, 1) + 1) / 2) * windowFrames;

// Random starting offset (percent of canvas) and rotation for the fly-in,
// re-seeded per scene so the scatter direction varies each time. `offsetRange`
// controls how far apart pieces start — small for a gentle "close the gap"
// settle, large for a dramatic fly-in from off-canvas.
export const cellFlightStart = (cellId: string, sceneId: string, offsetRange = 55, rotationRange = 35) => ({
  offsetX: seededJitter(`${sceneId}-startX-${cellId}`, offsetRange),
  offsetY: seededJitter(`${sceneId}-startY-${cellId}`, offsetRange),
  rotation: seededJitter(`${sceneId}-startRot-${cellId}`, rotationRange),
});
