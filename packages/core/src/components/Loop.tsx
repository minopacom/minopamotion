import React, { useContext, useMemo, type ReactNode, type CSSProperties } from 'react';
import { TimelineContext, type TimelineContextValue } from '../contexts/timeline-context.js';

interface LoopProps {
  children: ReactNode;
  durationInFrames: number;
  times?: number;
  layout?: 'absolute-fill' | 'none';
  style?: CSSProperties;
}

const absoluteFillStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

export function Loop({
  children,
  durationInFrames,
  times = Infinity,
  layout = 'absolute-fill',
  style,
}: LoopProps) {
  const timeline = useContext(TimelineContext);

  const loopedTimeline = useMemo<TimelineContextValue>(() => {
    const totalDuration = durationInFrames * times;
    const effectiveFrame =
      timeline.frame >= totalDuration
        ? durationInFrames - 1
        : timeline.frame % durationInFrames;

    return {
      ...timeline,
      frame: effectiveFrame,
    };
  }, [timeline, durationInFrames, times]);

  const content = (
    <TimelineContext.Provider value={loopedTimeline}>{children}</TimelineContext.Provider>
  );

  if (layout === 'none') {
    return content;
  }

  return <div style={{ ...absoluteFillStyle, ...style }}>{content}</div>;
}
