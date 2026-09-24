import React from 'react';
import {Img, OffthreadVideo, interpolate, spring, staticFile, useVideoConfig} from 'remotion';
import type {Tile} from './types';
import {seededJitter, seededPick} from './jitter';
import {PAPER_TEXTURES, PLASTIC_SHINES} from './textures';

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
    shine,
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

  // Settle-impact: a brief soft shadow bloom right as the tile lands, so it
  // reads as a physical print dropping into place rather than a flat fade-in.
  const landBloom = interpolate(localFrame, [duration - 6, duration, duration + 10], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const px = (v: number) => (v / 100) * compWidth;
  const py = (v: number) => (v / 100) * compHeight;

  const paperTexture = seededPick(id + 'paper', PAPER_TEXTURES);
  const shineTexture = seededPick(id + 'shine', PLASTIC_SHINES);
  const shineRotation = seededJitter(id + 'shineRot', 60);

  const shadowBlur = 24 + landBloom * 20;
  const shadowSpread = 2 + landBloom * 4;

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    left: px(currentX) - px(width) / 2,
    top: py(currentY) - py(height) / 2,
    width: px(width),
    height: py(height),
    transform: `rotate(${currentRotation}deg)`,
    zIndex,
    opacity,
    overflow: 'hidden',
    borderRadius: 2,
    backgroundImage: `url(${staticFile(paperTexture)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: `0 ${10 + landBloom * 6}px ${shadowBlur}px ${shadowSpread}px rgba(35,26,18,0.32)`,
  };

  return (
    <div style={cardStyle}>
      {color && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: color,
            mixBlendMode: 'multiply',
          }}
        />
      )}
      {src && type === 'image' && (
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      )}
      {src && type === 'video' && (
        <OffthreadVideo src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      )}
      {shine && (
        <img
          src={staticFile(shineTexture)}
          style={{
            position: 'absolute',
            inset: '-20%',
            width: '140%',
            height: '140%',
            objectFit: 'cover',
            transform: `rotate(${shineRotation}deg)`,
            mixBlendMode: 'screen',
            opacity: 0.28,
          }}
        />
      )}
      {/* Paper-edge vignette: darkens the card perimeter so it reads as a
          distinct physical print rather than a flat cutout. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 24px 2px rgba(20,15,10,0.22)',
        }}
      />
    </div>
  );
};
