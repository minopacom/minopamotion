import { useContext } from 'react';
import { TimelineContext } from '../contexts/timeline-context.js';
import { SequenceContext } from '../contexts/sequence-context.js';

export function useCurrentFrame(): number {
  const timeline = useContext(TimelineContext);
  const sequence = useContext(SequenceContext);

  if (sequence === null) {
    return timeline.frame;
  }

  return timeline.frame - sequence.cumulatedFrom - sequence.relativeFrom;
}
