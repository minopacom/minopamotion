import React, { useState, useRef, useCallback, type ReactNode } from 'react';
import { TimelineContext, type TimelineContextValue } from '../contexts/timeline-context.js';
import { CompositionManagerProvider } from '../contexts/composition-manager.js';
import { EnvironmentContext, type Environment } from '../contexts/environment-context.js';

interface MinopaRootProps {
  children: ReactNode;
  numberOfSharedAudioTags?: number;
  environment?: Environment;
}

export function MinopaRoot({ children, environment = 'player' }: MinopaRootProps) {
  const [frame, setFrameState] = useState(0);
  const [playing, setPlaying] = useState(false);
  const imperativePlaying = useRef(false);

  const setFrame = useCallback((f: number) => {
    setFrameState(f);
  }, []);

  const timelineValue: TimelineContextValue = {
    frame,
    playing,
    playbackRate: 1,
    imperativePlaying,
    setFrame,
  };

  // Expose setPlaying for internal use
  void setPlaying;

  return (
    <EnvironmentContext.Provider value={environment}>
      <TimelineContext.Provider value={timelineValue}>
        <CompositionManagerProvider>{children}</CompositionManagerProvider>
      </TimelineContext.Provider>
    </EnvironmentContext.Provider>
  );
}
