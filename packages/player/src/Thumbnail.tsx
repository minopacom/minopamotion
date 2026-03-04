import React, { useMemo, useEffect, useRef, useState, type CSSProperties } from 'react';
import { TimelineContext, VideoConfigContext, EnvironmentContext, type TimelineContextValue, type VideoConfig } from '@minopamotion/core/internals';
import type { ThumbnailProps } from './types/player.js';

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

export function Thumbnail<Props extends Record<string, unknown>>({
  component: Component,
  inputProps,
  compositionWidth,
  compositionHeight,
  fps,
  durationInFrames,
  frameToDisplay,
  style,
  className,
}: ThumbnailProps<Props>) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: compositionWidth, height: compositionHeight });

  const timelineValue = useMemo<TimelineContextValue>(
    () => ({
      frame: frameToDisplay,
      playing: false,
      playbackRate: 1,
      imperativePlaying: { current: false },
      setFrame: () => {},
    }),
    [frameToDisplay],
  );

  const config = useMemo<VideoConfig>(
    () => ({ width: compositionWidth, height: compositionHeight, fps, durationInFrames }),
    [compositionWidth, compositionHeight, fps, durationInFrames],
  );

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

  const offsetX = (containerSize.width - compositionWidth * scale) / 2;
  const offsetY = (containerSize.height - compositionHeight * scale) / 2;

  return (
    <div ref={outerRef} style={{ ...containerStyle, ...style }} className={className}>
      <EnvironmentContext.Provider value="player">
        <TimelineContext.Provider value={timelineValue}>
          <VideoConfigContext.Provider value={config}>
            <div
              style={{
                ...canvasContainerStyle,
                width: compositionWidth,
                height: compositionHeight,
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              }}
            >
              <Component {...((inputProps ?? {}) as Props)} />
            </div>
          </VideoConfigContext.Provider>
        </TimelineContext.Provider>
      </EnvironmentContext.Provider>
    </div>
  );
}
