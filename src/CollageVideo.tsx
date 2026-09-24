import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CellRect, CollageScene} from './types';
import {cellFlightStart, cellTilt} from './cellMotion';

const GRID_BACKGROUND = '#F3F2EF';

// First scene: every piece is visible from frame 0, all starting close to
// their resting slot, and all drift inward together to close the gap.
const SETTLE_FLIGHT_FRAMES = 16;
const SETTLE_OFFSET_RANGE = 3;
const SETTLE_ROTATION_RANGE = 3;

// Every scene after the first: no travel, just a quick flash-in.
const FLASH_FRAMES = 3;

// Closing beat: the last scene's pieces scatter back apart.
const OUTRO_FLIGHT_FRAMES = 20;
const OUTRO_OFFSET_RANGE = 45;
const OUTRO_ROTATION_RANGE = 30;
const OUTRO_SEED = 'outro';

const resolveScenes = (scenes: CollageScene[]) => {
  let cumulative = 0;
  return scenes.map((scene) => {
    const resolved = {...scene, sceneStart: cumulative};
    cumulative += scene.durationInFrames;
    return resolved;
  });
};

export const totalDuration = (scenes: CollageScene[]): number =>
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0) + OUTRO_FLIGHT_FRAMES + 10;

const CollageCell: React.FC<{
  cell: CellRect;
  src: string;
  compWidth: number;
  compHeight: number;
  fps: number;
  frame: number;
  sceneStart: number;
  isFirst: boolean;
  isOutro: boolean;
}> = ({cell, src, compWidth, compHeight, fps, frame, sceneStart, isFirst, isOutro}) => {
  const left = (cell.x / 100) * compWidth;
  const top = (cell.y / 100) * compHeight;
  const width = (cell.width / 100) * compWidth;
  const height = (cell.height / 100) * compHeight;
  const restRotation = cellTilt(cell.id);
  const localFrame = frame - sceneStart;

  const img = <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;

  const box = (transform: string, opacity: number): React.CSSProperties => ({
    position: 'absolute',
    left,
    top,
    width,
    height,
    opacity,
    overflow: 'hidden',
    transform,
  });

  if (isOutro) {
    const progress = spring({frame: localFrame, fps, durationInFrames: OUTRO_FLIGHT_FRAMES, config: {damping: 200, mass: 0.7}});
    const target = cellFlightStart(cell.id, OUTRO_SEED, OUTRO_OFFSET_RANGE, OUTRO_ROTATION_RANGE);
    const offsetXPx = (interpolate(progress, [0, 1], [0, target.offsetX]) / 100) * compWidth;
    const offsetYPx = (interpolate(progress, [0, 1], [0, target.offsetY]) / 100) * compHeight;
    const rotation = interpolate(progress, [0, 1], [restRotation, restRotation + target.rotation]);
    const opacity = interpolate(localFrame, [OUTRO_FLIGHT_FRAMES - 8, OUTRO_FLIGHT_FRAMES], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return <div style={box(`translate(${offsetXPx}px, ${offsetYPx}px) rotate(${rotation}deg)`, opacity)}>{img}</div>;
  }

  if (!isFirst) {
    const opacity = interpolate(localFrame, [0, FLASH_FRAMES], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return <div style={box(`rotate(${restRotation}deg)`, opacity)}>{img}</div>;
  }

  const progress = spring({frame: localFrame, fps, durationInFrames: SETTLE_FLIGHT_FRAMES, config: {damping: 200, mass: 0.9}});
  const start = cellFlightStart(cell.id, 'scene-1', SETTLE_OFFSET_RANGE, SETTLE_ROTATION_RANGE);
  const offsetXPx = (interpolate(progress, [0, 1], [start.offsetX, 0]) / 100) * compWidth;
  const offsetYPx = (interpolate(progress, [0, 1], [start.offsetY, 0]) / 100) * compHeight;
  const rotation = interpolate(progress, [0, 1], [start.rotation, restRotation]);
  return <div style={box(`translate(${offsetXPx}px, ${offsetYPx}px) rotate(${rotation}deg)`, 1)}>{img}</div>;
};

export const CollageVideo: React.FC<{scenes: CollageScene[]}> = ({scenes}) => {
  const frame = useCurrentFrame();
  const {width: compWidth, height: compHeight, fps} = useVideoConfig();
  const resolved = resolveScenes(scenes);
  const scenesEnd = resolved[resolved.length - 1].sceneStart + resolved[resolved.length - 1].durationInFrames;

  const isOutro = frame >= scenesEnd;
  const activeScene = isOutro ? resolved[resolved.length - 1] : resolved.slice().reverse().find((s) => s.sceneStart <= frame) ?? resolved[0];
  const sceneStart = isOutro ? scenesEnd : activeScene.sceneStart;
  const isFirst = !isOutro && activeScene.id === resolved[0].id;

  return (
    <AbsoluteFill style={{backgroundColor: GRID_BACKGROUND}}>
      {activeScene.cells.map((cell) => (
        <CollageCell
          key={cell.id}
          cell={cell}
          src={activeScene.images[cell.id]}
          compWidth={compWidth}
          compHeight={compHeight}
          fps={fps}
          frame={frame}
          sceneStart={sceneStart}
          isFirst={isFirst}
          isOutro={isOutro}
        />
      ))}
    </AbsoluteFill>
  );
};
