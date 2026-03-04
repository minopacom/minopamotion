import React, { useContext, useMemo, type ReactNode, type CSSProperties } from 'react';
import { SequenceContext } from '../contexts/sequence-context.js';
import { TimelineContext } from '../contexts/timeline-context.js';
import type { SequenceContextType } from '../types/sequence.js';

interface SequenceProps {
  children: ReactNode;
  from?: number;
  durationInFrames?: number;
  name?: string;
  layout?: 'absolute-fill' | 'none';
  style?: CSSProperties;
  className?: string;
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

export function Sequence({
  children,
  from = 0,
  durationInFrames = Infinity,
  name,
  layout = 'absolute-fill',
  style,
  className,
}: SequenceProps) {
  const parentSequence = useContext(SequenceContext);
  const timeline = useContext(TimelineContext);

  const contextValue = useMemo<SequenceContextType>(() => {
    const parentCumulated = parentSequence?.cumulatedFrom ?? 0;
    const parentRelative = parentSequence?.relativeFrom ?? 0;

    return {
      cumulatedFrom: parentCumulated + parentRelative,
      relativeFrom: from,
      durationInFrames,
      parentFrom: from,
    };
  }, [parentSequence, from, durationInFrames]);

  const absoluteFrom = contextValue.cumulatedFrom + contextValue.relativeFrom;
  const currentFrame = timeline.frame - absoluteFrom;

  if (currentFrame < 0 || currentFrame >= durationInFrames) {
    return null;
  }

  const content = (
    <SequenceContext.Provider value={contextValue}>{children}</SequenceContext.Provider>
  );

  if (layout === 'none') {
    return content;
  }

  return (
    <div
      style={{ ...absoluteFillStyle, ...style }}
      className={className}
      data-sequence-name={name}
    >
      {content}
    </div>
  );
}
