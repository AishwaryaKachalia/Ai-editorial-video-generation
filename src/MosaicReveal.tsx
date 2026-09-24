import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {MosaicGrid, MosaicScene} from './types';
import {revealFraction, cellJitterFrames} from './revealOrder';
import {PAPER_TEXTURES} from './textures';
import {seededPick} from './jitter';
import {GrainOverlay} from './GrainOverlay';

const CROSSFADE_FRAMES = 5;

type ResolvedScene = MosaicScene & {sceneStart: number};

const resolveScenes = (scenes: MosaicScene[]): ResolvedScene[] => {
  let cumulative = 0;
  return scenes.map((scene) => {
    const resolved = {...scene, sceneStart: cumulative};
    cumulative += scene.durationInFrames;
    return resolved;
  });
};

export const totalDuration = (scenes: MosaicScene[]): number =>
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0);

const swapFrame = (scene: ResolvedScene, row: number, col: number, rows: number, columns: number): number => {
  const frac = revealFraction(row, col, rows, columns, scene.pattern ?? 'bottom-up');
  const jitter = cellJitterFrames(row, col, scene.id, scene.revealDuration * 0.12);
  return scene.sceneStart + frac * scene.revealDuration + jitter;
};

const MosaicCell: React.FC<{
  row: number;
  col: number;
  rows: number;
  columns: number;
  scenes: ResolvedScene[];
  cellWidth: number;
  cellHeight: number;
  gapPx: number;
  compWidth: number;
  compHeight: number;
}> = ({row, col, rows, columns, scenes, cellWidth, cellHeight, gapPx, compWidth, compHeight}) => {
  const frame = useCurrentFrame();

  let currentIndex = -1;
  for (let i = 0; i < scenes.length; i++) {
    if (swapFrame(scenes[i], row, col, rows, columns) <= frame) {
      currentIndex = i;
    }
  }

  if (currentIndex === -1) {
    return null;
  }

  const currentScene = scenes[currentIndex];
  const currentSwap = swapFrame(currentScene, row, col, rows, columns);
  const fadeProgress = Math.min(1, Math.max(0, (frame - currentSwap) / CROSSFADE_FRAMES));
  const prevScene = currentIndex > 0 ? scenes[currentIndex - 1] : null;

  // Global offset so every cell's image lines up into one continuous picture.
  const imageLeft = -(col * cellWidth + gapPx / 2);
  const imageTop = -(row * cellHeight + gapPx / 2);

  const renderLayer = (scene: ResolvedScene, opacity: number, key: string) => (
    <div key={key} style={{position: 'absolute', inset: 0, opacity}}>
      {scene.src ? (
        <Img
          src={staticFile(scene.src)}
          style={{
            position: 'absolute',
            width: compWidth,
            height: compHeight,
            left: imageLeft,
            top: imageTop,
            objectFit: 'cover',
          }}
        />
      ) : (
        <div style={{position: 'absolute', inset: 0, backgroundColor: scene.color ?? '#ddd'}} />
      )}
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: col * cellWidth + gapPx / 2,
        top: row * cellHeight + gapPx / 2,
        width: cellWidth - gapPx,
        height: cellHeight - gapPx,
        overflow: 'hidden',
      }}
    >
      {prevScene && fadeProgress < 1 && renderLayer(prevScene, 1, 'prev')}
      {renderLayer(currentScene, fadeProgress < 1 ? fadeProgress : 1, 'current')}
    </div>
  );
};

export const MosaicReveal: React.FC<{scenes: MosaicScene[]; grid: MosaicGrid}> = ({scenes, grid}) => {
  const {width: compWidth, height: compHeight} = useVideoConfig();
  const {columns, rows, gapPx = 6} = grid;
  const resolved = resolveScenes(scenes);
  const cellWidth = compWidth / columns;
  const cellHeight = compHeight / rows;
  const paperBg = seededPick('mosaic-bg', PAPER_TEXTURES);

  const cells: React.ReactNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      cells.push(
        <MosaicCell
          key={`${row}-${col}`}
          row={row}
          col={col}
          rows={rows}
          columns={columns}
          scenes={resolved}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          gapPx={gapPx}
          compWidth={compWidth}
          compHeight={compHeight}
        />,
      );
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile(paperBg)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {cells}
      <GrainOverlay />
    </AbsoluteFill>
  );
};
