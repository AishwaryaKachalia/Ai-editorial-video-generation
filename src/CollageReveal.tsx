import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import type {Scene} from './types';
import {CollageTile} from './CollageTile';

const CollageScene: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const tiles = [...scene.tiles].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

  return (
    <AbsoluteFill style={{backgroundColor: scene.background ?? '#f5f3ef'}}>
      {tiles.map((tile) => (
        <CollageTile key={tile.id} tile={tile} sceneFrame={frame} />
      ))}
    </AbsoluteFill>
  );
};

export const CollageReveal: React.FC<{scenes: Scene[]}> = ({scenes}) => {
  let cumulative = 0;

  return (
    <AbsoluteFill>
      {scenes.map((scene) => {
        const from = cumulative;
        cumulative += scene.durationInFrames;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} name={scene.id}>
            <CollageScene scene={scene} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const totalDuration = (scenes: Scene[]): number =>
  scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);
