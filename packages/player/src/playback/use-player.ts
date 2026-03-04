import { useCallback, useContext } from 'react';
import { MediaVolumeContext } from '@minopamotion/core/internals';
import type { PlayerEmitter } from '../events/player-emitter.js';

interface UsePlayerOptions {
  play: () => void;
  pause: () => void;
  seekTo: (frame: number) => void;
  isPlaying: () => boolean;
  emitter: PlayerEmitter;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
}

export function usePlayer({
  play,
  pause,
  seekTo,
  isPlaying,
  emitter,
  playbackRate,
  setPlaybackRate,
}: UsePlayerOptions) {
  const mediaVolume = useContext(MediaVolumeContext);

  const toggle = useCallback(() => {
    if (isPlaying()) {
      pause();
    } else {
      play();
    }
  }, [play, pause, isPlaying]);

  const getCurrentFrame = useCallback(() => {
    // Will be read from timeline context at the call site
    return 0;
  }, []);

  return {
    play,
    pause,
    toggle,
    seekTo,
    getCurrentFrame,
    isPlaying,
    getVolume: () => mediaVolume.volume,
    setVolume: (v: number) => mediaVolume.setVolume(v),
    isMuted: () => mediaVolume.muted,
    mute: () => mediaVolume.setMuted(true),
    unmute: () => mediaVolume.setMuted(false),
    getPlaybackRate: () => playbackRate,
    setPlaybackRate: (rate: number) => {
      setPlaybackRate(rate);
      emitter.emit('ratechange', rate);
    },
    addEventListener: emitter.on.bind(emitter),
    emitter,
  };
}
