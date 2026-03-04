import { createContext } from 'react';

export interface TimelineContextValue {
  frame: number;
  playing: boolean;
  playbackRate: number;
  imperativePlaying: React.RefObject<boolean>;
  setFrame: (frame: number) => void;
}

export const TimelineContext = createContext<TimelineContextValue>({
  frame: 0,
  playing: false,
  playbackRate: 1,
  imperativePlaying: { current: false },
  setFrame: () => {
    throw new Error('TimelineContext not provided');
  },
});
