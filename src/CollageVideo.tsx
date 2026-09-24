import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CellRect, CollageScene} from './types';
import {cellFlightDelay, cellJumbleStart, cellTilt} from './cellMotion';

// Self-hosted (not fetched live from Google Fonts at render time — this
// sandbox's headless Chromium doesn't trust the network proxy's CA for
// external font requests, so the font is downloaded once into /public).
const fontFamily = 'Manrope';
const FontFace = () => (
  <style>{`
    @font-face {
      font-family: 'Manrope';
      font-style: normal;
      font-weight: 500;
      src: url('${staticFile('fonts/Manrope-Medium.woff2')}') format('woff2');
    }
  `}</style>
);

const GRID_BACKGROUND = '#F3F2EF';
const LOGO_SRC = 'images/logo-mark.png';

// Every scene: pieces appear jumbled (pushed outward from center, leaving
// the middle empty) and HOLD there — that's the beat the word reads over —
// before converging into the puzzle.
const JUMBLE_HOLD_FRAMES = 18; // ~0.6s at 30fps, within the requested 0.5-0.7s
const JUMBLE_FLIGHT_FRAMES = 22;
const JUMBLE_STAGGER_WINDOW = 10;
const JUMBLE_MAGNITUDE = 30;
const JUMBLE_ROTATION_RANGE = 28;
const PIECE_FADE_IN_FRAMES = 6;

// Word: fades in with the jumbled pieces, holds through the jumble, fades
// out as the pieces start converging.
const WORD_FADE_IN_FRAMES = 6;
const WORD_FADE_OUT_END = JUMBLE_HOLD_FRAMES + 8;

// Closing beat: the last (already-assembled) scene blurs and the logo
// fades in on top — no re-jumbling.
const OUTRO_TOTAL_FRAMES = 50;
const OUTRO_BLUR_MAX = 28;
const OUTRO_BLUR_FRAMES = 30;
const LOGO_FADE_START = 14;
const LOGO_FADE_FRAMES = 18;

const resolveScenes = (scenes: CollageScene[]) => {
  let cumulative = 0;
  return scenes.map((scene) => {
    const resolved = {...scene, sceneStart: cumulative};
    cumulative += scene.durationInFrames;
    return resolved;
  });
};

export const totalDuration = (scenes: CollageScene[]): number =>
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0) + OUTRO_TOTAL_FRAMES;

const CollageCell: React.FC<{
  cell: CellRect;
  src: string;
  compWidth: number;
  compHeight: number;
  fps: number;
  localFrame: number;
  sceneId: string;
  skipJumble?: boolean;
}> = ({cell, src, compWidth, compHeight, fps, localFrame, sceneId, skipJumble}) => {
  const left = (cell.x / 100) * compWidth;
  const top = (cell.y / 100) * compHeight;
  const width = (cell.width / 100) * compWidth;
  const height = (cell.height / 100) * compHeight;
  const restRotation = cellTilt(cell.id);

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

  if (skipJumble) {
    // Last scene: already assembled, no re-jumble right before the outro.
    return <div style={box(`rotate(${restRotation}deg)`, 1)}>{img}</div>;
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
          color: '#2B2B28',
          fontFamily,
          fontWeight: 500,
          textTransform: 'uppercase',
          fontSize: 52,
          letterSpacing: 8,
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{src: string; localFrame: number; compWidth: number; compHeight: number}> = ({
  src,
  localFrame,
  compWidth,
  compHeight,
}) => {
  const blur = interpolate(localFrame, [0, OUTRO_BLUR_FRAMES], [0, OUTRO_BLUR_MAX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logoOpacity = interpolate(localFrame, [LOGO_FADE_START, LOGO_FADE_START + LOGO_FADE_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{width: compWidth, height: compHeight, objectFit: 'cover', filter: `blur(${blur}px)`}}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            opacity: logoOpacity,
            width: '78%',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            backgroundColor: 'rgba(30,28,26,0.92)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Img src={staticFile(LOGO_SRC)} style={{width: '76%', height: '76%', objectFit: 'contain'}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CollageVideo: React.FC<{scenes: CollageScene[]}> = ({scenes}) => {
  const frame = useCurrentFrame();
  const {width: compWidth, height: compHeight, fps} = useVideoConfig();
  const resolved = resolveScenes(scenes);
  const lastScene = resolved[resolved.length - 1];
  const scenesEnd = lastScene.sceneStart + lastScene.durationInFrames;

  const isOutro = frame >= scenesEnd;
  const activeScene = isOutro ? lastScene : resolved.slice().reverse().find((s) => s.sceneStart <= frame) ?? resolved[0];
  const sceneStart = isOutro ? scenesEnd : activeScene.sceneStart;
  const localFrame = frame - sceneStart;
  const isLastScene = activeScene.id === lastScene.id;

  return (
    <AbsoluteFill style={{backgroundColor: GRID_BACKGROUND}}>
      <FontFace />
      {isOutro ? (
        <Outro src={lastScene.src} localFrame={localFrame} compWidth={compWidth} compHeight={compHeight} />
      ) : (
        <>
          {activeScene.cells.map((cell) => (
            <CollageCell
              key={cell.id}
              cell={cell}
              src={activeScene.src}
              compWidth={compWidth}
              compHeight={compHeight}
              fps={fps}
              localFrame={localFrame}
              sceneId={activeScene.id}
              skipJumble={isLastScene}
            />
          ))}
          {activeScene.word && <WordOverlay word={activeScene.word} localFrame={localFrame} />}
        </>
      )}
    </AbsoluteFill>
  );
};
