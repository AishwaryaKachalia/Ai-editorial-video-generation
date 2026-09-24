import React from 'react';
import {Composition} from 'remotion';
import {CollageReveal, totalDuration} from './CollageReveal';
import {exampleScenes} from './scenes/example';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CollageReveal"
      component={CollageReveal}
      durationInFrames={totalDuration(exampleScenes)}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{scenes: exampleScenes}}
    />
  );
};
