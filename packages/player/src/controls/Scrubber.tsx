import React, { useCallback, useRef, type CSSProperties } from 'react';

interface ScrubberProps {
  currentFrame: number;
  durationInFrames: number;
  onSeek: (frame: number) => void;
}

const containerStyle: CSSProperties = {
  width: '100%',
  height: 6,
  background: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 3,
  cursor: 'pointer',
  position: 'relative',
};

const fillStyle: CSSProperties = {
  height: '100%',
  background: '#fff',
  borderRadius: 3,
  pointerEvents: 'none',
};

export function Scrubber({ currentFrame, durationInFrames, onSeek }: ScrubberProps) {
  const barRef = useRef<HTMLDivElement>(null);

  const getFrameFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const bar = barRef.current;
      if (!bar) return 0;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      return Math.round(ratio * (durationInFrames - 1));
    },
    [durationInFrames],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      onSeek(getFrameFromEvent(e));

      const handleMove = (moveEvent: MouseEvent) => {
        onSeek(getFrameFromEvent(moveEvent));
      };
      const handleUp = () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },
    [onSeek, getFrameFromEvent],
  );

  const progress = durationInFrames > 1 ? currentFrame / (durationInFrames - 1) : 0;

  return (
    <div ref={barRef} style={containerStyle} onMouseDown={handleMouseDown}>
      <div style={{ ...fillStyle, width: `${progress * 100}%` }} />
    </div>
  );
}
