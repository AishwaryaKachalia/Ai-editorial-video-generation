import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CellRect, CollageScene} from './types';
import {cellFlightDelay, cellFlightStart, cellJumbleStart, cellTilt} from './cellMotion';

// Self-hosted (not fetched live from Google Fonts at render time — this
// sandbox's headless Chromium doesn't trust the network proxy's CA for
// external font requests, so the font is downloaded once into /public).
const fontFamily = 'Manrope';
const FontFace = () => (
  <style>{`
    @font-face {
      font-family: 'Manrope';
      font-style: normal;
      font-weight: 800;
      src: url('${staticFile('fonts/Manrope-ExtraBold.woff2')}') format('woff2');
    }
  `}</style>
);

const GRID_BACKGROUND = '#F3F2EF';

// Every scene: pieces appear jumbled (pushed outward from center, leaving
// the middle empty) and HOLD there — that's the beat the word reads over —
// before converging into the puzzle.
const JUMBLE_HOLD_FRAMES = 18; // ~0.6s at 30fps, within the requested 0.5-0.7s
const JUMBLE_FLIGHT_FRAMES = 22;
const JUMBLE_STAGGER_WINDOW = 10;
const JUMBLE_MAGNITUDE = 30;
const JUMBLE_ROTATION_RANGE = 28;
const PIECE_FADE_IN_FRAMES = 6;

// Closing beat: the last scene's pieces scatter back apart.
const OUTRO_FLIGHT_FRAMES = 20;
const OUTRO_OFFSET_RANGE = 45;
const OUTRO_ROTATION_RANGE = 30;
const OUTRO_SEED = 'outro';

// Word: fades in with the jumbled pieces, holds through the jumble, fades
// out as the pieces start converging.
const WORD_FADE_IN_FRAMES = 6;
const WORD_FADE_OUT_END = JUMBLE_HOLD_FRAMES + 8;

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
  const flightFrame = localFrame - JUMBLE_HOLD_FRAMES - staggerDelay;

  const start = cellJumbleStart(cell, sceneId, JUMBLE_MAGNITUDE, JUMBLE_ROTATION_RANGE);
  const progress =
    flightFrame < 0 ? 0 : spring({frame: flightFrame, fps, durationInFrames: JUMBLE_FLIGHT_FRAMES, config: {damping: 200, mass: 0.8}});
  const offsetXPx = (interpolate(progress, [0, 1], [start.offsetX, 0]) / 100) * compWidth;
  const offsetYPx = (interpolate(progress, [0, 1], [start.offsetY, 0]) / 100) * compHeight;
  const rotation = interpolate(progress, [0, 1], [start.rotation, restRotation]);
  const opacity = interpolate(localFrame, [0, PIECE_FADE_IN_FRAMES], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={box(`translate(${offsetXPx}px, ${offsetYPx}px) rotate(${rotation}deg)`, opacity)}>{img}</div>;
};

const WordOverlay: React.FC<{word: string; localFrame: number}> = ({word, localFrame}) => {
  const opacity = interpolate(
    localFrame,
    [0, WORD_FADE_IN_FRAMES, JUMBLE_HOLD_FRAMES, WORD_FADE_OUT_END],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          opacity,
          color: '#F3F2EF',
          fontFamily,
          fontWeight: 800,
          textTransform: 'uppercase',
          fontSize: 96,
          letterSpacing: 2,
          textShadow: '0 2px 24px rgba(0,0,0,0.5)',
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
      <FontFace />
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
      {!isOutro && activeScene.word && <WordOverlay word={activeScene.word} localFrame={localFrame} />}
    </AbsoluteFill>
  );
};
