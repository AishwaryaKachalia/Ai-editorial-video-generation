import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {GRAIN_OVERLAY} from './textures';

// A constant film-grain + soft vignette layer sits above every scene, unifying
// the whole video the way real print/film grain would, instead of each scene
// looking like a flat digital render.
export const GrainOverlay: React.FC = () => {
  return (
    <AbsoluteFill style={{zIndex: 9999, pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile(GRAIN_OVERLAY)})`,
          backgroundSize: '900px',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
          opacity: 0.22,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(20,15,10,0.28) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
