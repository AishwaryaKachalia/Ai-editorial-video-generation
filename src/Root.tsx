import React from 'react';
import {Composition} from 'remotion';
import {MosaicReveal, totalDuration} from './MosaicReveal';
import {mosaicExampleScenes} from './scenes/mosaicExample';
import {collageGridCells} from './grids/collageGrid';
import {FramePreview, framePreviewDuration} from './FramePreview';

const grid = {cells: collageGridCells, gapPx: 0};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MosaicReveal"
        component={MosaicReveal}
        durationInFrames={totalDuration(mosaicExampleScenes)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{scenes: mosaicExampleScenes, grid}}
      />
      <Composition
        id="FramePreview"
        component={FramePreview}
        durationInFrames={framePreviewDuration}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
