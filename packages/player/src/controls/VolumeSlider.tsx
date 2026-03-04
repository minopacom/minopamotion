import React, { useCallback, useRef, type CSSProperties } from 'react';

interface VolumeSliderProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (v: number) => void;
  onMutedChange: (m: boolean) => void;
}

const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const sliderContainerStyle: CSSProperties = {
  width: 60,
  height: 4,
  background: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 2,
  cursor: 'pointer',
  position: 'relative',
};

const sliderFillStyle: CSSProperties = {
  height: '100%',
  background: '#fff',
  borderRadius: 2,
  pointerEvents: 'none',
};

const buttonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  padding: 4,
  fontSize: 14,
};

export function VolumeSlider({ volume, muted, onVolumeChange, onMutedChange }: VolumeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const getVolumeFromEvent = useCallback((e: React.MouseEvent | MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      onVolumeChange(getVolumeFromEvent(e));
      const handleMove = (moveEvent: MouseEvent) => onVolumeChange(getVolumeFromEvent(moveEvent));
      const handleUp = () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },
    [onVolumeChange, getVolumeFromEvent],
  );

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={() => onMutedChange(!muted)} type="button">
        {muted || volume === 0 ? '\u{1F507}' : '\u{1F50A}'}
      </button>
      <div ref={sliderRef} style={sliderContainerStyle} onMouseDown={handleMouseDown}>
        <div style={{ ...sliderFillStyle, width: `${(muted ? 0 : volume) * 100}%` }} />
      </div>
    </div>
  );
}
