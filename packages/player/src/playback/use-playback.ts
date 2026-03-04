import { useRef, useCallback, useEffect, useContext } from 'react';
import { TimelineContext } from '@minopamotion/core/internals';
import { calculateNextFrame } from './calculate-next-frame.js';
import { isBackgrounded, onVisibilityChange } from './is-backgrounded.js';
import type { PlayerEmitter } from '../events/player-emitter.js';

interface UsePlaybackOptions {
  fps: number;
  durationInFrames: number;
  loop: boolean;
  playbackRate: number;
  emitter: PlayerEmitter;
}

export function usePlayback({ fps, durationInFrames, loop, playbackRate, emitter }: UsePlaybackOptions) {
  const timeline = useContext(TimelineContext);
  const rafId = useRef<number>(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const playingRef = useRef(false);

  const stopLoop = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (!playingRef.current) return;

    const now = performance.now();
    const { frame, ended } = calculateNextFrame({
      currentFrame: timeline.frame,
      durationInFrames,
      fps,
      playbackRate,
      startTime: startTimeRef.current,
      now,
      loop,
    });

    if (frame !== timeline.frame) {
      timeline.setFrame(frame);
      emitter.emit('frameupdate', frame);
    }

    if (ended) {
      playingRef.current = false;
      timeline.imperativePlaying.current = false;
      emitter.emit('ended', undefined as never);
      emitter.emit('pause', undefined as never);
      stopLoop();
      return;
    }

    if (isBackgrounded()) {
      timeoutId.current = setTimeout(tick, 1000 / fps);
    } else {
      rafId.current = requestAnimationFrame(tick);
    }
  }, [timeline, durationInFrames, fps, playbackRate, loop, emitter, stopLoop]);

  const play = useCallback(() => {
    if (playingRef.current) return;

    // If at end, restart
    if (timeline.frame >= durationInFrames - 1 && !loop) {
      timeline.setFrame(0);
      emitter.emit('frameupdate', 0);
    }

    playingRef.current = true;
    timeline.imperativePlaying.current = true;
    startTimeRef.current = performance.now() - (timeline.frame / fps) * 1000 / playbackRate;
    emitter.emit('play', undefined as never);
    rafId.current = requestAnimationFrame(tick);
  }, [timeline, durationInFrames, fps, playbackRate, loop, emitter, tick]);

  const pause = useCallback(() => {
    if (!playingRef.current) return;
    playingRef.current = false;
    timeline.imperativePlaying.current = false;
    emitter.emit('pause', undefined as never);
    stopLoop();
  }, [timeline, emitter, stopLoop]);

  const seekTo = useCallback(
    (frame: number) => {
      const clamped = Math.max(0, Math.min(frame, durationInFrames - 1));
      timeline.setFrame(clamped);
      emitter.emit('seeked', clamped);
      emitter.emit('frameupdate', clamped);
      if (playingRef.current) {
        startTimeRef.current = performance.now() - (clamped / fps) * 1000 / playbackRate;
      }
    },
    [timeline, durationInFrames, fps, playbackRate, emitter],
  );

  // Handle background tab changes
  useEffect(() => {
    return onVisibilityChange((hidden) => {
      if (!playingRef.current) return;
      if (!hidden) {
        // Recalculate start time to avoid jumps
        startTimeRef.current = performance.now() - (timeline.frame / fps) * 1000 / playbackRate;
        stopLoop();
        rafId.current = requestAnimationFrame(tick);
      }
    });
  }, [timeline, fps, playbackRate, tick, stopLoop]);

  // Cleanup
  useEffect(() => stopLoop, [stopLoop]);

  return { play, pause, seekTo, isPlaying: () => playingRef.current };
}
