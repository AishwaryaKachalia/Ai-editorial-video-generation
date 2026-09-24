import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CellRect} from './types';
import {namedFrames} from './grids/frames';
import {cellFlightDelay, cellFlightStart, cellTilt} from './cellMotion';

const GRID_BACKGROUND = '#F3F2EF';
const FRAMES_PER_LAYOUT = 45;
const FLIGHT_FRAMES = 22;
const STAGGER_WINDOW = 20;
const PALETTE = ['#c9beac', '#8a9a8b', '#b98a72', '#7f8fa6', '#d6b98c', '#a68a9a', '#8fa68f'];

const AnimatedCell: React.FC<{
  cell: CellRect;
  index: number;
  layoutId: string;
  localFrame: number;
  compWidth: number;
  compHeight: number;
  fps: number;
}> = ({cell, index, layoutId, localFrame, compWidth, compHeight, fps}) => {
  const left = (cell.x / 100) * compWidth;
  const top = (cell.y / 100) * compHeight;
  const width = (cell.width / 100) * compWidth;
  const height = (cell.height / 100) * compHeight;

  const restRotation = cellTilt(cell.id);
  const delay = cellFlightDelay(cell.id, layoutId, STAGGER_WINDOW);
  const flightFrame = localFrame - delay;

  if (flightFrame < 0) return null;

  const progress = spring({frame: flightFrame, fps, durationInFrames: FLIGHT_FRAMES, config: {damping: 200, mass: 0.7}});
  const start = cellFlightStart(cell.id, layoutId);
  const offsetXPct = interpolate(progress, [0, 1], [start.offsetX, 0]);
  const offsetYPct = interpolate(progress, [0, 1], [start.offsetY, 0]);
  const rotation = interpolate(progress, [0, 1], [start.rotation, restRotation]);
  const opacity = interpolate(flightFrame, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const offsetXPx = (offsetXPct / 100) * compWidth;
  const offsetYPx = (offsetYPct / 100) * compHeight;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        opacity,
        zIndex: Math.round(delay * 10),
        transform: `translate(${offsetXPx}px, ${offsetYPx}px) rotate(${rotation}deg)`,
        backgroundColor: PALETTE[index % PALETTE.length],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.85)',
        fontFamily: 'sans-serif',
        fontSize: 22,
      }}
    >
      {cell.id}
    </div>
  );
};

// Fragments fly into place to form each layout, hold, then the next layout's
// fragments fly in — same motion as the real composition, still placeholder
// colors and no images, for reviewing layout + motion together.
export const FramePreview: React.FC = () => {
  const frame = useCurrentFrame();
  const {width: compWidth, height: compHeight, fps} = useVideoConfig();
  const index = Math.min(namedFrames.length - 1, Math.floor(frame / FRAMES_PER_LAYOUT));
  const layout = namedFrames[index];
  const localFrame = frame - index * FRAMES_PER_LAYOUT;

  return (
    <AbsoluteFill style={{backgroundColor: GRID_BACKGROUND}}>
      {layout.cells.map((cell: CellRect, i: number) => (
        <AnimatedCell
          key={`${layout.id}-${cell.id}`}
          cell={cell}
          index={i}
          layoutId={layout.id}
          localFrame={localFrame}
          compWidth={compWidth}
          compHeight={compHeight}
          fps={fps}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          color: '#3f342a',
          fontFamily: 'sans-serif',
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        {layout.id}
      </div>
    </AbsoluteFill>
  );
};

export const framePreviewDuration = namedFrames.length * FRAMES_PER_LAYOUT;
