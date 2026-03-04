import React, { useState, useRef, useCallback, useMemo, type ReactNode } from 'react';
import {
  TimelineContext,
  type TimelineContextValue,
  VideoConfigContext,
  EnvironmentContext,
  MediaVolumeContext,
  type MediaVolumeContextValue,
  DelayRenderContext,
  type DelayRenderHandle,
  type DelayRenderContextValue,
} from '@minopamotion/core/internals';
import type { VideoConfig } from '@minopamotion/core/internals';

interface SharedPlayerContextProps {
  children: ReactNode;
  initialFrame: number;
  config: VideoConfig;
}

export function SharedPlayerContext({ children, initialFrame, config }: SharedPlayerContextProps) {
  const [frame, setFrame] = useState(initialFrame);
  const [playing, setPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const imperativePlaying = useRef(false);

  const [volume, setVolumeState] = useState(1);
  const [muted, setMutedState] = useState(false);

  const delayHandles = useRef<DelayRenderHandle[]>([]);

  const setFrameCallback = useCallback((f: number) => {
    setFrame(f);
  }, []);

  const timelineValue = useMemo<TimelineContextValue>(
    () => ({
      frame,
      playing,
      playbackRate,
      imperativePlaying,
      setFrame: setFrameCallback,
    }),
    [frame, playing, playbackRate, setFrameCallback],
  );

  const mediaVolumeValue = useMemo<MediaVolumeContextValue>(
    () => ({
      volume,
      muted,
      setVolume: setVolumeState,
      setMuted: setMutedState,
    }),
    [volume, muted],
  );

  const delayRenderValue = useMemo<DelayRenderContextValue>(
    () => ({
      handles: delayHandles,
      addHandle: (h: DelayRenderHandle) => {
        delayHandles.current = [...delayHandles.current, h];
      },
      removeHandle: (id: number) => {
        delayHandles.current = delayHandles.current.filter((h) => h.id !== id);
      },
    }),
    [],
  );

  return (
    <EnvironmentContext.Provider value="player">
      <TimelineContext.Provider value={timelineValue}>
        <VideoConfigContext.Provider value={config}>
          <MediaVolumeContext.Provider value={mediaVolumeValue}>
            <DelayRenderContext.Provider value={delayRenderValue}>
              {children}
            </DelayRenderContext.Provider>
          </MediaVolumeContext.Provider>
        </VideoConfigContext.Provider>
      </TimelineContext.Provider>
    </EnvironmentContext.Provider>
  );
}

export { type SharedPlayerContextProps };
