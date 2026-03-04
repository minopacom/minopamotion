import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
} from '@minopamotion/core';

export function MyComposition() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const translateY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          fontSize: 60,
          fontWeight: 'bold',
          fontFamily: 'system-ui, sans-serif',
          color: '#fff',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        Minopamotion
      </div>

      <Sequence from={30} durationInFrames={60}>
        <SubTitle />
      </Sequence>

      <Sequence from={60} durationInFrames={30}>
        <FadeOut />
      </Sequence>
    </AbsoluteFill>
  );
}

function SubTitle() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 160,
        opacity,
        fontSize: 24,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      Programmatic video creation with React
    </div>
  );
}

function FadeOut() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 0.6], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${opacity})` }} />
  );
}
