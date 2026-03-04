import type { ComponentType, CSSProperties } from 'react';
import type { PlayerEmitter, PlayerEventMap } from '../events/player-emitter.js';

export interface PlayerProps<Props extends Record<string, unknown> = Record<string, unknown>> {
  component: ComponentType<Props>;
  inputProps?: Props;
  durationInFrames: number;
  compositionWidth: number;
  compositionHeight: number;
  fps: number;
  loop?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  style?: CSSProperties;
  className?: string;
  clickToPlay?: boolean;
  doubleClickToFullscreen?: boolean;
  initialFrame?: number;
  playbackRate?: number;
  showVolumeControls?: boolean;
}

export interface PlayerRef {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekTo: (frame: number) => void;
  getCurrentFrame: () => number;
  isPlaying: () => boolean;
  getVolume: () => number;
  setVolume: (volume: number) => void;
  isMuted: () => boolean;
  mute: () => void;
  unmute: () => void;
  getPlaybackRate: () => number;
  setPlaybackRate: (rate: number) => void;
  addEventListener: <K extends keyof PlayerEventMap>(
    event: K,
    listener: (data: PlayerEventMap[K]) => void,
  ) => () => void;
  emitter: PlayerEmitter;
}

export interface ThumbnailProps<Props extends Record<string, unknown> = Record<string, unknown>> {
  component: ComponentType<Props>;
  inputProps?: Props;
  compositionWidth: number;
  compositionHeight: number;
  fps: number;
  durationInFrames: number;
  frameToDisplay: number;
  style?: CSSProperties;
  className?: string;
}
