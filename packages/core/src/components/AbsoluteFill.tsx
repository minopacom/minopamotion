import React, { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

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

export const AbsoluteFill = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ style, ...props }, ref) => {
    return <div ref={ref} style={{ ...absoluteFillStyle, ...style }} {...props} />;
  },
);

AbsoluteFill.displayName = 'AbsoluteFill';
