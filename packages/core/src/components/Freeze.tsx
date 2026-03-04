import React, { useMemo, useContext, type ReactNode } from 'react';
import { TimelineContext, type TimelineContextValue } from '../contexts/timeline-context.js';

interface FreezeProps {
  children: ReactNode;
  frame: number;
}

export function Freeze({ children, frame }: FreezeProps) {
  const timeline = useContext(TimelineContext);

  const frozenTimeline = useMemo<TimelineContextValue>(
    () => ({
      ...timeline,
      frame,
      playing: false,
    }),
    [timeline, frame],
  );

  return (
    <TimelineContext.Provider value={frozenTimeline}>{children}</TimelineContext.Provider>
  );
}
