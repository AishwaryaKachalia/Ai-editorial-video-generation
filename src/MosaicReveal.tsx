import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CellRect, MosaicGrid, MosaicScene} from './types';
import {buildRevealRanks, cellTilt, cellTimingJitter} from './revealOrder';

const GRID_BACKGROUND = '#F3F2EF';

const CROSSFADE_FRAMES = 4;

type ResolvedScene = MosaicScene & {sceneStart: number; ranks: Map<string, number>; cellCount: number};

const resolveScenes = (scenes: MosaicScene[], cells: CellRect[]): ResolvedScene[] => {
  let cumulative = 0;
  return scenes.map((scene) => {
    const ranks = buildRevealRanks(cells, scene.pattern ?? 'bottom-up', scene.id);
    const resolved = {...scene, sceneStart: cumulative, ranks, cellCount: cells.length};
    cumulative += scene.durationInFrames;
    return resolved;
  });
};

export const totalDuration = (scenes: MosaicScene[]): number =>
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0);

const swapFrame = (scene: ResolvedScene, cellId: string): number => {
  const rank = scene.ranks.get(cellId) ?? 0;
  const fraction = scene.cellCount <= 1 ? 0 : rank / (scene.cellCount - 1);
  const jitter = cellTimingJitter(cellId, scene.id);
  return scene.sceneStart + fraction * scene.revealDuration + jitter;
};

const MosaicCell: React.FC<{
  cell: CellRect;
  scenes: ResolvedScene[];
  gapPx: number;
  compWidth: number;
  compHeight: number;
}> = ({cell, scenes, gapPx, compWidth, compHeight}) => {
  const frame = useCurrentFrame();

  let currentIndex = -1;
  for (let i = 0; i < scenes.length; i++) {
    if (swapFrame(scenes[i], cell.id) <= frame) {
      currentIndex = i;
    }
  }

  if (currentIndex === -1) {
    return null;
  }

  const currentScene = scenes[currentIndex];
  const currentSwap = swapFrame(currentScene, cell.id);
  const fadeProgress = Math.min(1, Math.max(0, (frame - currentSwap) / CROSSFADE_FRAMES));
  const prevScene = currentIndex > 0 ? scenes[currentIndex - 1] : null;

  const cellLeftPx = (cell.x / 100) * compWidth;
  const cellTopPx = (cell.y / 100) * compHeight;
  const cellWidthPx = (cell.width / 100) * compWidth;
  const cellHeightPx = (cell.height / 100) * compHeight;

  // Global offset so every cell's image lines up into one continuous picture.
  const imageLeft = -(cellLeftPx + gapPx / 2);
  const imageTop = -(cellTopPx + gapPx / 2);

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
        left: cellLeftPx + gapPx / 2,
        top: cellTopPx + gapPx / 2,
        width: cellWidthPx - gapPx,
        height: cellHeightPx - gapPx,
        overflow: 'hidden',
        transform: `rotate(${cellTilt(cell.id)}deg)`,
      }}
    >
      {prevScene && fadeProgress < 1 && renderLayer(prevScene, 1, 'prev')}
      {renderLayer(currentScene, fadeProgress < 1 ? fadeProgress : 1, 'current')}
    </div>
  );
};

export const MosaicReveal: React.FC<{scenes: MosaicScene[]; grid: MosaicGrid}> = ({scenes, grid}) => {
  const {width: compWidth, height: compHeight} = useVideoConfig();
  const {cells, gapPx = 6} = grid;
  const resolved = useMemo(() => resolveScenes(scenes, cells), [scenes, cells]);

  return (
    <AbsoluteFill style={{backgroundColor: GRID_BACKGROUND}}>
      {cells.map((cell) => (
        <MosaicCell key={cell.id} cell={cell} scenes={resolved} gapPx={gapPx} compWidth={compWidth} compHeight={compHeight} />
      ))}
    </AbsoluteFill>
  );
};
