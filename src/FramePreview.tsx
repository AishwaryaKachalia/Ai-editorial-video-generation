import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CellRect} from './types';
import {namedFrames} from './grids/frames';

const GRID_BACKGROUND = '#F3F2EF';
const FRAMES_PER_LAYOUT = 45;
const PALETTE = ['#c9beac', '#8a9a8b', '#b98a72', '#7f8fa6', '#d6b98c', '#a68a9a', '#8fa68f'];

// Static preview: cuts between each named layout so block proportions can be
// reviewed before any real photo is wired in. No animation, no images.
export const FramePreview: React.FC = () => {
  const frame = useCurrentFrame();
  const {width: compWidth, height: compHeight} = useVideoConfig();
  const index = Math.min(namedFrames.length - 1, Math.floor(frame / FRAMES_PER_LAYOUT));
  const layout = namedFrames[index];
  const gapPx = 6;

  return (
    <AbsoluteFill style={{backgroundColor: GRID_BACKGROUND}}>
      {layout.cells.map((cell: CellRect, i: number) => {
        const left = (cell.x / 100) * compWidth + gapPx / 2;
        const top = (cell.y / 100) * compHeight + gapPx / 2;
        const width = (cell.width / 100) * compWidth - gapPx;
        const height = (cell.height / 100) * compHeight - gapPx;
        return (
          <div
            key={cell.id}
            style={{
              position: 'absolute',
              left,
              top,
              width,
              height,
              backgroundColor: PALETTE[i % PALETTE.length],
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
      })}
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
