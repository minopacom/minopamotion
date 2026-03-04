import React, { type CSSProperties } from 'react';
import { Scrubber } from './Scrubber.js';
import { VolumeSlider } from './VolumeSlider.js';

interface PlayerControlsProps {
  currentFrame: number;
  durationInFrames: number;
  fps: number;
  playing: boolean;
  onToggle: () => void;
  onSeek: (frame: number) => void;
  volume: number;
  muted: boolean;
  onVolumeChange: (v: number) => void;
  onMutedChange: (m: boolean) => void;
  showVolumeControls: boolean;
}

const controlsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 8px',
  background: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 12,
};

const playButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  padding: 4,
  fontSize: 16,
  lineHeight: 1,
};

const timeStyle: CSSProperties = {
  minWidth: 80,
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
};

function formatTime(frame: number, fps: number): string {
  const totalSeconds = frame / fps;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const frames = frame % fps;
  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(frames).padStart(2, '0')}`;
}

export function PlayerControls({
  currentFrame,
  durationInFrames,
  fps,
  playing,
  onToggle,
  onSeek,
  volume,
  muted,
  onVolumeChange,
  onMutedChange,
  showVolumeControls,
}: PlayerControlsProps) {
  return (
    <div style={controlsStyle}>
      <button style={playButtonStyle} onClick={onToggle} type="button">
        {playing ? '\u{23F8}' : '\u{25B6}'}
      </button>
      <div style={{ flex: 1 }}>
        <Scrubber currentFrame={currentFrame} durationInFrames={durationInFrames} onSeek={onSeek} />
      </div>
      <span style={timeStyle}>
        {formatTime(currentFrame, fps)} / {formatTime(durationInFrames - 1, fps)}
      </span>
      {showVolumeControls && (
        <VolumeSlider
          volume={volume}
          muted={muted}
          onVolumeChange={onVolumeChange}
          onMutedChange={onMutedChange}
        />
      )}
    </div>
  );
}
