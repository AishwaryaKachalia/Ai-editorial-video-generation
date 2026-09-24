import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CellRect, CollageScene} from './types';
import {cellFlightDelay, cellFlightStart, cellJumbleStart, cellTilt} from './cellMotion';

const GRID_BACKGROUND = '#F3F2EF';

// Every scene: pieces start jumbled (pushed outward from center, leaving the
// middle empty) and converge into the puzzle, staggered so many are moving
// at once.
const JUMBLE_FLIGHT_FRAMES = 26;
const JUMBLE_STAGGER_WINDOW = 14;
const JUMBLE_MAGNITUDE = 30;
const JUMBLE_ROTATION_RANGE = 28;

// Closing beat: the last scene's pieces scatter back apart.
const OUTRO_FLIGHT_FRAMES = 20;
const OUTRO_OFFSET_RANGE = 45;
const OUTRO_ROTATION_RANGE = 30;
const OUTRO_SEED = 'outro';

// Word overlay: fades in once the puzzle has mostly assembled, holds, fades
// out before the next scene's pieces start jumbling.
const WORD_IN_START = JUMBLE_STAGGER_WINDOW + JUMBLE_FLIGHT_FRAMES - 6;
const WORD_FADE_FRAMES = 12;

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
  sceneId: string;
  isOutro: boolean;
}> = ({cell, src, compWidth, compHeight, fps, frame, sceneStart, sceneId, isOutro}) => {
  const left = (cell.x / 100) * compWidth;
  const top = (cell.y / 100) * compHeight;
  const width = (cell.width / 100) * compWidth;
  const height = (cell.height / 100) * compHeight;
  const restRotation = cellTilt(cell.id);
  const localFrame = frame - sceneStart;

  const img = (
    <Img
      src={staticFile(src)}
      style={{position: 'absolute', width: compWidth, height: compHeight, left: -left, top: -top, objectFit: 'cover'}}
    />
  );

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

  const staggerDelay = cellFlightDelay(cell.id, sceneId, JUMBLE_STAGGER_WINDOW);
  const flightFrame = localFrame - staggerDelay;

  const progress = spring({frame: flightFrame, fps, durationInFrames: JUMBLE_FLIGHT_FRAMES, config: {damping: 200, mass: 0.8}});
  const start = cellJumbleStart(cell, sceneId, JUMBLE_MAGNITUDE, JUMBLE_ROTATION_RANGE);
  const offsetXPx = (interpolate(progress, [0, 1], [start.offsetX, 0]) / 100) * compWidth;
  const offsetYPx = (interpolate(progress, [0, 1], [start.offsetY, 0]) / 100) * compHeight;
  const rotation = interpolate(progress, [0, 1], [start.rotation, restRotation]);
  const opacity = interpolate(flightFrame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={box(`translate(${offsetXPx}px, ${offsetYPx}px) rotate(${rotation}deg)`, opacity)}>{img}</div>;
};

const WordOverlay: React.FC<{word: string; localFrame: number; sceneDuration: number}> = ({word, localFrame, sceneDuration}) => {
  const fadeOutStart = sceneDuration - WORD_FADE_FRAMES;
  const opacity = interpolate(
    localFrame,
    [WORD_IN_START, WORD_IN_START + WORD_FADE_FRAMES, fadeOutStart, sceneDuration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '10%', pointerEvents: 'none'}}>
      <div
        style={{
          opacity,
          color: '#F3F2EF',
          fontFamily: 'Georgia, serif',
          fontSize: 88,
          letterSpacing: 1,
          textShadow: '0 2px 24px rgba(0,0,0,0.45)',
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

export const CollageVideo: React.FC<{scenes: CollageScene[]}> = ({scenes}) => {
  const frame = useCurrentFrame();
  const {width: compWidth, height: compHeight, fps} = useVideoConfig();
  const resolved = resolveScenes(scenes);
  const scenesEnd = resolved[resolved.length - 1].sceneStart + resolved[resolved.length - 1].durationInFrames;

  const isOutro = frame >= scenesEnd;
  const activeScene = isOutro ? resolved[resolved.length - 1] : resolved.slice().reverse().find((s) => s.sceneStart <= frame) ?? resolved[0];
  const sceneStart = isOutro ? scenesEnd : activeScene.sceneStart;
  const localFrame = frame - sceneStart;

  return (
    <AbsoluteFill style={{backgroundColor: GRID_BACKGROUND}}>
      {activeScene.cells.map((cell) => (
        <CollageCell
          key={cell.id}
          cell={cell}
          src={activeScene.src}
          compWidth={compWidth}
          compHeight={compHeight}
          fps={fps}
          frame={frame}
          sceneStart={sceneStart}
          sceneId={activeScene.id}
          isOutro={isOutro}
        />
      ))}
      {!isOutro && activeScene.word && (
        <WordOverlay word={activeScene.word} localFrame={localFrame} sceneDuration={activeScene.durationInFrames} />
      )}
    </AbsoluteFill>
  );
};
