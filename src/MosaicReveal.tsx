import React, {useMemo} from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CellRect, MosaicGrid, MosaicScene} from './types';
import {cellFlightDelay, cellFlightStart, cellTilt} from './cellMotion';

const GRID_BACKGROUND = '#F3F2EF';

// How long a single fragment's fly takes, and how wide a window its start is
// staggered across — flights overlap heavily inside that window, which is
// what makes the assembly/disassembly read as chaotic rather than
// one-at-a-time.
const FLIGHT_FRAMES = 22;
const STAGGER_WINDOW = 20;
// The closing beat: fragments of the last image scatter back apart,
// mirroring the intro. Long enough for every staggered flight to finish.
const OUTRO_FRAMES = STAGGER_WINDOW + FLIGHT_FRAMES;
const OUTRO_SEED = 'outro';

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
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0) + OUTRO_FRAMES;

const CellContent: React.FC<{scene: MosaicScene; compWidth: number; compHeight: number; imageLeft: number; imageTop: number}> = ({
  scene,
  compWidth,
  compHeight,
  imageLeft,
  imageTop,
}) => {
  if (!scene.src) {
    return <div style={{position: 'absolute', inset: 0, backgroundColor: scene.color ?? '#ddd'}} />;
  }
  return (
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
  );
};

const MosaicCell: React.FC<{
  cell: CellRect;
  scenes: ResolvedScene[];
  gapPx: number;
  compWidth: number;
  compHeight: number;
  fps: number;
}> = ({cell, scenes, gapPx, compWidth, compHeight, fps}) => {
  const frame = useCurrentFrame();

  const lastScene = scenes[scenes.length - 1];
  const scenesEnd = lastScene.sceneStart + lastScene.durationInFrames;

  const restRotation = cellTilt(cell.id);
  const cellLeftPx = (cell.x / 100) * compWidth;
  const cellTopPx = (cell.y / 100) * compHeight;
  const cellWidthPx = (cell.width / 100) * compWidth;
  const cellHeightPx = (cell.height / 100) * compHeight;
  const imageLeft = -(cellLeftPx + gapPx / 2);
  const imageTop = -(cellTopPx + gapPx / 2);

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: cellLeftPx + gapPx / 2,
    top: cellTopPx + gapPx / 2,
    width: cellWidthPx - gapPx,
    height: cellHeightPx - gapPx,
    overflow: 'hidden',
  };

  const renderContent = (scene: MosaicScene) => (
    <CellContent scene={scene} compWidth={compWidth} compHeight={compHeight} imageLeft={imageLeft} imageTop={imageTop} />
  );

  if (frame >= scenesEnd) {
    // Outro: the last image's fragments scatter back apart, mirroring the intro.
    const outroFrame = frame - scenesEnd;
    const delay = cellFlightDelay(cell.id, OUTRO_SEED, STAGGER_WINDOW);
    const flightFrame = outroFrame - delay;

    if (flightFrame < 0) {
      return (
        <div style={{...baseStyle, transform: `rotate(${restRotation}deg)`}}>{renderContent(lastScene)}</div>
      );
    }

    const progress = spring({frame: flightFrame, fps, durationInFrames: FLIGHT_FRAMES, config: {damping: 200, mass: 0.7}});
    const target = cellFlightStart(cell.id, OUTRO_SEED);
    const offsetXPct = interpolate(progress, [0, 1], [0, target.offsetX]);
    const offsetYPct = interpolate(progress, [0, 1], [0, target.offsetY]);
    const rotation = interpolate(progress, [0, 1], [restRotation, restRotation + target.rotation]);
    const opacity = interpolate(flightFrame, [FLIGHT_FRAMES - 8, FLIGHT_FRAMES], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const offsetXPx = (offsetXPct / 100) * compWidth;
    const offsetYPx = (offsetYPct / 100) * compHeight;

    return (
      <div
        style={{
          ...baseStyle,
          opacity,
          zIndex: Math.round(delay * 10),
          transform: `translate(${offsetXPx}px, ${offsetYPx}px) rotate(${rotation}deg)`,
        }}
      >
        {renderContent(lastScene)}
      </div>
    );
  }

  let currentIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    if (scenes[i].sceneStart <= frame) currentIndex = i;
    else break;
  }
  const scene = scenes[currentIndex];
  const prevScene = currentIndex > 0 ? scenes[currentIndex - 1] : null;
  const localFrame = frame - scene.sceneStart;
  const delay = cellFlightDelay(cell.id, scene.id, STAGGER_WINDOW);
  const flightFrame = localFrame - delay;

  if (flightFrame < 0) {
    // Hasn't started flying in yet: show the previous scene settled in place
    // (fragments peel away to reveal the next image), or nothing on scene 1.
    if (!prevScene) return null;
    return <div style={{...baseStyle, transform: `rotate(${restRotation}deg)`}}>{renderContent(prevScene)}</div>;
  }

  const progress = spring({frame: flightFrame, fps, durationInFrames: FLIGHT_FRAMES, config: {damping: 200, mass: 0.7}});
  const start = cellFlightStart(cell.id, scene.id);
  const offsetXPct = interpolate(progress, [0, 1], [start.offsetX, 0]);
  const offsetYPct = interpolate(progress, [0, 1], [start.offsetY, 0]);
  const rotation = interpolate(progress, [0, 1], [start.rotation, restRotation]);
  const opacity = interpolate(flightFrame, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const offsetXPx = (offsetXPct / 100) * compWidth;
  const offsetYPx = (offsetYPct / 100) * compHeight;

  return (
    <div
      style={{
        ...baseStyle,
        opacity,
        zIndex: Math.round(delay * 10),
        transform: `translate(${offsetXPx}px, ${offsetYPx}px) rotate(${rotation}deg)`,
      }}
    >
      {renderContent(scene)}
    </div>
  );
};

export const MosaicReveal: React.FC<{scenes: MosaicScene[]; grid: MosaicGrid}> = ({scenes, grid}) => {
  const {width: compWidth, height: compHeight, fps} = useVideoConfig();
  const {cells, gapPx = 6} = grid;
  const resolved = useMemo(() => resolveScenes(scenes), [scenes]);

  return (
    <AbsoluteFill style={{backgroundColor: GRID_BACKGROUND}}>
      {cells.map((cell) => (
        <MosaicCell key={cell.id} cell={cell} scenes={resolved} gapPx={gapPx} compWidth={compWidth} compHeight={compHeight} fps={fps} />
      ))}
    </AbsoluteFill>
  );
};
