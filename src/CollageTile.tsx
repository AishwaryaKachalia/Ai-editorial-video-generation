import React from 'react';
import {Img, OffthreadVideo, interpolate, spring, staticFile, useVideoConfig} from 'remotion';
import type {Tile} from './types';
import {seededJitter} from './jitter';

export const CollageTile: React.FC<{tile: Tile; sceneFrame: number}> = ({tile, sceneFrame}) => {
  const {fps, width: compWidth, height: compHeight} = useVideoConfig();
  const {
    id,
    src,
    type = 'image',
    x,
    y,
    width,
    height,
    rotation = 0,
    startFrame,
    duration = 18,
    zIndex = 0,
    color,
  } = tile;

  const localFrame = sceneFrame - startFrame;
  if (localFrame < 0) return null;

  const fromX = tile.fromX ?? x + (seededJitter(id + 'x', 1) >= 0 ? 45 : -45);
  const fromY = tile.fromY ?? y + seededJitter(id + 'y', 20);
  const fromRotation = tile.fromRotation ?? rotation + seededJitter(id + 'r', 25);

  const progress = spring({
    frame: localFrame,
    fps,
    durationInFrames: duration,
    config: {damping: 200, mass: 0.6},
  });

  const currentX = interpolate(progress, [0, 1], [fromX, x]);
  const currentY = interpolate(progress, [0, 1], [fromY, y]);
  const currentRotation = interpolate(progress, [0, 1], [fromRotation, rotation]);
  const opacity = interpolate(localFrame, [0, Math.max(Math.round(duration * 0.3), 4)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const px = (v: number) => (v / 100) * compWidth;
  const py = (v: number) => (v / 100) * compHeight;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: px(currentX) - px(width) / 2,
    top: py(currentY) - py(height) / 2,
    width: px(width),
    height: py(height),
    transform: `rotate(${currentRotation}deg)`,
    zIndex,
    opacity,
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: color ?? '#e5e2dd',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  };

  return (
    <div style={style}>
      {src && type === 'image' && (
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      )}
      {src && type === 'video' && (
        <OffthreadVideo src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      )}
    </div>
  );
};
