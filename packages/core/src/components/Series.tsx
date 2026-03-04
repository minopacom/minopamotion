import React, { Children, type ReactNode, type ReactElement, type CSSProperties } from 'react';
import { Sequence } from './Sequence.js';

interface SeriesSequenceProps {
  children: ReactNode;
  durationInFrames: number;
  offset?: number;
  layout?: 'absolute-fill' | 'none';
  style?: CSSProperties;
  className?: string;
  name?: string;
}

function SeriesSequence(_props: SeriesSequenceProps): ReactElement {
  throw new Error('<Series.Sequence> should only be used as a direct child of <Series>');
}

interface SeriesProps {
  children: ReactNode;
}

function Series({ children }: SeriesProps) {
  const childArray = Children.toArray(children) as ReactElement<SeriesSequenceProps>[];

  let currentFrom = 0;
  const elements: ReactNode[] = [];

  for (const child of childArray) {
    if (child.type !== SeriesSequence) {
      throw new Error('Only <Series.Sequence> is allowed as a child of <Series>');
    }

    const { durationInFrames, offset = 0, children: seqChildren, layout, style, className, name } = child.props;
    const from = currentFrom + offset;

    elements.push(
      <Sequence
        key={from}
        from={from}
        durationInFrames={durationInFrames}
        layout={layout}
        style={style}
        className={className}
        name={name}
      >
        {seqChildren}
      </Sequence>,
    );

    currentFrom = from + durationInFrames;
  }

  return <>{elements}</>;
}

Series.Sequence = SeriesSequence;

export { Series };
