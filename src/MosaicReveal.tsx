import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {MosaicGrid, MosaicScene} from './types';
import {buildRevealRanks, cellTilt, cellTimingJitter} from './revealOrder';

const GRID_BACKGROUND = '#F3F2EF';

const CROSSFADE_FRAMES = 4;

type ResolvedScene = MosaicScene & {sceneStart: number; ranks: Map<string, number>; cellCount: number};

const resolveScenes = (scenes: MosaicScene[], rows: number, columns: number): ResolvedScene[] => {
  let cumulative = 0;
  return scenes.map((scene) => {
    const ranks = buildRevealRanks(rows, columns, scene.pattern ?? 'bottom-up', scene.id);
    const resolved = {...scene, sceneStart: cumulative, ranks, cellCount: rows * columns};
    cumulative += scene.durationInFrames;
    return resolved;
  });
};

export const totalDuration = (scenes: MosaicScene[]): number =>
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0);

const swapFrame = (scene: ResolvedScene, row: number, col: number): number => {
  const rank = scene.ranks.get(`${row}-${col}`) ?? 0;
  const fraction = scene.cellCount <= 1 ? 0 : rank / (scene.cellCount - 1);
  const jitter = cellTimingJitter(row, col, scene.id);
  return scene.sceneStart + fraction * scene.revealDuration + jitter;
};

const MosaicCell: React.FC<{
  row: number;
  col: number;
  scenes: ResolvedScene[];
  cellWidth: number;
  cellHeight: number;
  gapPx: number;
  compWidth: number;
  compHeight: number;
}> = ({row, col, scenes, cellWidth, cellHeight, gapPx, compWidth, compHeight}) => {
  const frame = useCurrentFrame();

  let currentIndex = -1;
  for (let i = 0; i < scenes.length; i++) {
    if (swapFrame(scenes[i], row, col) <= frame) {
      currentIndex = i;
    }
  }

  if (currentIndex === -1) {
    return null;
  }

  const currentScene = scenes[currentIndex];
  const currentSwap = swapFrame(currentScene, row, col);
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
        transform: `rotate(${cellTilt(row, col)}deg)`,
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
  const resolved = useMemo(() => resolveScenes(scenes, rows, columns), [scenes, rows, columns]);
  const cellWidth = compWidth / columns;
  const cellHeight = compHeight / rows;

  const cells: React.ReactNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      cells.push(
        <MosaicCell
          key={`${row}-${col}`}
          row={row}
          col={col}
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

  return <AbsoluteFill style={{backgroundColor: GRID_BACKGROUND}}>{cells}</AbsoluteFill>;
};
