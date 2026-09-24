import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CellRect} from './types';
import {namedFrames} from './grids/frames';
import {cellFlightStart, cellTilt} from './cellMotion';

const GRID_BACKGROUND = '#F3F2EF';
const FRAMES_PER_LAYOUT = 45;

// First layout: every piece is visible from frame 0, all starting close to
// their resting slot (visibly gapped, not scattered off-canvas), and all
// drift inward together to close the gap — no stagger, or pieces that
// haven't appeared yet read as a hole in the image, not "still arriving."
const SETTLE_FLIGHT_FRAMES = 16;
const SETTLE_OFFSET_RANGE = 3;
const SETTLE_ROTATION_RANGE = 3;

// Every layout after the first: no travel, just a quick flash-in.
const FLASH_FRAMES = 3;

const PALETTE = ['#c9beac', '#8a9a8b', '#b98a72', '#7f8fa6', '#d6b98c', '#a68a9a', '#8fa68f'];

const AnimatedCell: React.FC<{
  cell: CellRect;
  index: number;
  layoutId: string;
  localFrame: number;
  isFirst: boolean;
  compWidth: number;
  compHeight: number;
  fps: number;
}> = ({cell, index, layoutId, localFrame, isFirst, compWidth, compHeight, fps}) => {
  const left = (cell.x / 100) * compWidth;
  const top = (cell.y / 100) * compHeight;
  const width = (cell.width / 100) * compWidth;
  const height = (cell.height / 100) * compHeight;
  const restRotation = cellTilt(cell.id);

  const boxStyle = (transform: string, opacity: number, zIndex: number): React.CSSProperties => ({
    position: 'absolute',
    left,
    top,
    width,
    height,
    opacity,
    zIndex,
    transform,
    backgroundColor: PALETTE[index % PALETTE.length],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'sans-serif',
    fontSize: 22,
  });

  if (!isFirst) {
    // Flash: appear almost instantly at rest, no travel.
    if (localFrame < 0) return null;
    const opacity = interpolate(localFrame, [0, FLASH_FRAMES], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return <div style={boxStyle(`rotate(${restRotation}deg)`, opacity, index)}>{cell.id}</div>;
  }

  const progress = spring({
    frame: localFrame,
    fps,
    durationInFrames: SETTLE_FLIGHT_FRAMES,
    config: {damping: 200, mass: 0.9},
  });
  const start = cellFlightStart(cell.id, layoutId, SETTLE_OFFSET_RANGE, SETTLE_ROTATION_RANGE);
  const offsetXPct = interpolate(progress, [0, 1], [start.offsetX, 0]);
  const offsetYPct = interpolate(progress, [0, 1], [start.offsetY, 0]);
  const rotation = interpolate(progress, [0, 1], [start.rotation, restRotation]);
  const offsetXPx = (offsetXPct / 100) * compWidth;
  const offsetYPx = (offsetYPct / 100) * compHeight;

  return (
    <div style={boxStyle(`translate(${offsetXPx}px, ${offsetYPx}px) rotate(${rotation}deg)`, 1, index)}>
      {cell.id}
    </div>
  );
};

// First layout: pieces start close to their slot and drift inward to close
// the gap. Every layout after that: just flashes in. Placeholder colors,
// no images — for reviewing layout + motion together.
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
          isFirst={index === 0}
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
