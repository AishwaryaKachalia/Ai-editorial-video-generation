import React from 'react';
import {Composition} from 'remotion';
import {CollageVideo, totalDuration} from './CollageVideo';
import {collageScenes} from './scenes/collageScenes';
import {FramePreview, framePreviewDuration} from './FramePreview';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CollageVideo"
        component={CollageVideo}
        durationInFrames={totalDuration(collageScenes)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{scenes: collageScenes}}
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
