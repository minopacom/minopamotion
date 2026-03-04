import React, { useContext, useEffect, useRef, useState, type ComponentType, type CSSProperties } from 'react';
import { TimelineContext, MediaVolumeContext } from '@minopamotion/core/internals';
import { PlayerControls } from './controls/PlayerControls.js';

interface PlayerUIProps {
  component: ComponentType<Record<string, unknown>>;
  inputProps: Record<string, unknown>;
  compositionWidth: number;
  compositionHeight: number;
  durationInFrames: number;
  fps: number;
  controls: boolean;
  showVolumeControls: boolean;
  clickToPlay: boolean;
  onToggle: () => void;
  onSeek: (frame: number) => void;
  isPlaying: () => boolean;
  style?: CSSProperties;
  className?: string;
}

const containerStyle: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  background: '#000',
};

const canvasContainerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  transformOrigin: 'top left',
  overflow: 'hidden',
};

const controlsContainerStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 10,
};

export function PlayerUI({
  component: Component,
  inputProps,
  compositionWidth,
  compositionHeight,
  controls,
  showVolumeControls,
  clickToPlay,
  durationInFrames,
  fps,
  onToggle,
  onSeek,
  isPlaying,
  style,
  className,
}: PlayerUIProps) {
  const timeline = useContext(TimelineContext);
  const mediaVolume = useContext(MediaVolumeContext);
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: compositionWidth, height: compositionHeight });

  // Fit composition into container with ResizeObserver
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });

      const scaleX = width / compositionWidth;
      const scaleY = height / compositionHeight;
      setScale(Math.min(scaleX, scaleY));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [compositionWidth, compositionHeight]);

  const handleClick = () => {
    if (clickToPlay) {
      onToggle();
    }
  };

  const offsetX = (containerSize.width - compositionWidth * scale) / 2;
  const offsetY = (containerSize.height - compositionHeight * scale) / 2;

  return (
    <div
      ref={outerRef}
      style={{ ...containerStyle, ...style }}
      className={className}
      onClick={handleClick}
    >
      <div
        style={{
          ...canvasContainerStyle,
          width: compositionWidth,
          height: compositionHeight,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
        }}
      >
        <Component {...inputProps} />
      </div>
      {controls && (
        <div style={controlsContainerStyle} onClick={(e) => e.stopPropagation()}>
          <PlayerControls
            currentFrame={timeline.frame}
            durationInFrames={durationInFrames}
            fps={fps}
            playing={isPlaying()}
            onToggle={onToggle}
            onSeek={onSeek}
            volume={mediaVolume.volume}
            muted={mediaVolume.muted}
            onVolumeChange={mediaVolume.setVolume}
            onMutedChange={mediaVolume.setMuted}
            showVolumeControls={showVolumeControls}
          />
        </div>
      )}
    </div>
  );
}
