import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState, useEffect, type ComponentType } from 'react';
import type { VideoConfig } from '@minopamotion/core/internals';
import { SharedPlayerContext } from './context/SharedPlayerContext.js';
import { PlayerUI } from './PlayerUI.js';
import { PlayerEmitter } from './events/player-emitter.js';
import { usePlayback } from './playback/use-playback.js';
import { usePlayer } from './playback/use-player.js';
import type { PlayerProps, PlayerRef } from './types/player.js';

function PlayerInner<Props extends Record<string, unknown>>(
  {
    component,
    inputProps,
    durationInFrames,
    compositionWidth,
    compositionHeight,
    fps,
    loop = false,
    autoPlay = false,
    controls = true,
    style,
    className,
    clickToPlay = true,
    showVolumeControls = true,
    playbackRate: initialPlaybackRate = 1,
  }: PlayerProps<Props>,
  ref: React.ForwardedRef<PlayerRef>,
) {
  const [playbackRate, setPlaybackRate] = useState(initialPlaybackRate);
  const emitterRef = useRef(new PlayerEmitter());
  const emitter = emitterRef.current;

  const config: VideoConfig = useMemo(
    () => ({ width: compositionWidth, height: compositionHeight, fps, durationInFrames }),
    [compositionWidth, compositionHeight, fps, durationInFrames],
  );

  return (
    <SharedPlayerContext initialFrame={0} config={config}>
      <PlayerInnerWithContext
        ref={ref}
        component={component as ComponentType<Record<string, unknown>>}
        inputProps={(inputProps ?? {}) as Record<string, unknown>}
        durationInFrames={durationInFrames}
        compositionWidth={compositionWidth}
        compositionHeight={compositionHeight}
        fps={fps}
        loop={loop}
        autoPlay={autoPlay}
        controls={controls}
        style={style}
        className={className}
        clickToPlay={clickToPlay}
        showVolumeControls={showVolumeControls}
        playbackRate={playbackRate}
        setPlaybackRate={setPlaybackRate}
        emitter={emitter}
      />
    </SharedPlayerContext>
  );
}

interface PlayerInnerWithContextProps {
  component: ComponentType<Record<string, unknown>>;
  inputProps: Record<string, unknown>;
  durationInFrames: number;
  compositionWidth: number;
  compositionHeight: number;
  fps: number;
  loop: boolean;
  autoPlay: boolean;
  controls: boolean;
  style?: React.CSSProperties;
  className?: string;
  clickToPlay: boolean;
  showVolumeControls: boolean;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  emitter: PlayerEmitter;
}

const PlayerInnerWithContext = forwardRef<PlayerRef, PlayerInnerWithContextProps>(
  function PlayerInnerWithContext(
    {
      component,
      inputProps,
      durationInFrames,
      compositionWidth,
      compositionHeight,
      fps,
      loop,
      autoPlay,
      controls,
      style,
      className,
      clickToPlay,
      showVolumeControls,
      playbackRate,
      setPlaybackRate,
      emitter,
    },
    ref,
  ) {
    const { play, pause, seekTo, isPlaying } = usePlayback({
      fps,
      durationInFrames,
      loop,
      playbackRate,
      emitter,
    });

    const playerApi = usePlayer({
      play,
      pause,
      seekTo,
      isPlaying,
      emitter,
      playbackRate,
      setPlaybackRate,
    });

    useImperativeHandle(ref, () => playerApi, [playerApi]);

    // Auto-play
    useEffect(() => {
      if (autoPlay) {
        play();
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <PlayerUI
        component={component}
        inputProps={inputProps}
        compositionWidth={compositionWidth}
        compositionHeight={compositionHeight}
        durationInFrames={durationInFrames}
        fps={fps}
        controls={controls}
        showVolumeControls={showVolumeControls}
        clickToPlay={clickToPlay}
        onToggle={playerApi.toggle}
        onSeek={seekTo}
        isPlaying={isPlaying}
        style={style}
        className={className}
      />
    );
  },
);

export const Player = forwardRef(PlayerInner) as <
  Props extends Record<string, unknown> = Record<string, unknown>,
>(
  props: PlayerProps<Props> & { ref?: React.Ref<PlayerRef> },
) => React.ReactElement;
