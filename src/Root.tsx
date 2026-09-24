import React from 'react';
import {Composition} from 'remotion';
import {MosaicReveal, totalDuration} from './MosaicReveal';
import {mosaicExampleScenes} from './scenes/mosaicExample';

const grid = {columns: 3, rows: 4, gapPx: 6};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MosaicReveal"
      component={MosaicReveal}
      durationInFrames={totalDuration(mosaicExampleScenes)}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{scenes: mosaicExampleScenes, grid}}
    />
  );
};
