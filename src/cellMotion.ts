import {seededJitter} from './jitter';
import type {CellRect} from './types';

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

// Jumbled start: pushes each piece outward from canvas center along its own
// direction (not a random direction), so the pieces scatter toward the
// edges and the middle of the canvas reads empty — then they converge back
// into the puzzle. `magnitude` controls how far out they start.
export const cellJumbleStart = (cell: CellRect, sceneId: string, magnitude = 30, rotationRange = 30) => {
  const cellCenterX = cell.x + cell.width / 2;
  const cellCenterY = cell.y + cell.height / 2;
  const dx = cellCenterX - 50;
  const dy = cellCenterY - 50;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const dirX = dx / dist;
  const dirY = dy / dist;
  const jitteredMagnitude = magnitude + seededJitter(`${sceneId}-jumble-mag-${cell.id}`, magnitude * 0.35);
  return {
    offsetX: dirX * jitteredMagnitude,
    offsetY: dirY * jitteredMagnitude,
    rotation: seededJitter(`${sceneId}-jumble-rot-${cell.id}`, rotationRange),
  };
};
