import React, { useCallback, useRef } from 'react';
import { colors } from '../utils/colors.js';

interface PlayheadProps {
	currentFrame: number;
	durationInFrames: number;
	zoom: number;
	scrollLeft: number;
	width: number;
	height: number;
	onSeek: (frame: number) => void;
}

const HANDLE_WIDTH = 12;
const HANDLE_HEIGHT = 14;

export function Playhead({
	currentFrame,
	durationInFrames,
	zoom,
	scrollLeft,
	width,
	height,
	onSeek,
}: PlayheadProps) {
	const dragging = useRef(false);

	const pxPerFrame = (width * zoom) / durationInFrames;
	const x = currentFrame * pxPerFrame - scrollLeft;

	const frameFromClientX = useCallback(
		(clientX: number, containerLeft: number) => {
			const relX = clientX - containerLeft + scrollLeft;
			const frame = Math.round(relX / pxPerFrame);
			return Math.max(0, Math.min(durationInFrames - 1, frame));
		},
		[pxPerFrame, scrollLeft, durationInFrames],
	);

	const onMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			dragging.current = true;
			const container = (
				e.currentTarget as HTMLElement
			).parentElement!;
			const rect = container.getBoundingClientRect();

			const onMouseMove = (ev: MouseEvent) => {
				if (!dragging.current) return;
				onSeek(frameFromClientX(ev.clientX, rect.left));
			};

			const onMouseUp = () => {
				dragging.current = false;
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
			};

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		},
		[frameFromClientX, onSeek],
	);

	if (x < -HANDLE_WIDTH || x > width + HANDLE_WIDTH) return null;

	return (
		<>
			{/* Vertical line */}
			<div
				style={{
					position: 'absolute',
					left: x,
					top: 0,
					width: 1,
					height,
					background: colors.playhead,
					boxShadow: `0 0 4px ${colors.playheadGlow}`,
					pointerEvents: 'none',
					zIndex: 10,
				}}
			/>
			{/* Handle triangle */}
			<div
				onMouseDown={onMouseDown}
				style={{
					position: 'absolute',
					left: x - HANDLE_WIDTH / 2,
					top: 0,
					width: HANDLE_WIDTH,
					height: HANDLE_HEIGHT,
					cursor: 'ew-resize',
					zIndex: 11,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						width: 0,
						height: 0,
						borderLeft: `${HANDLE_WIDTH / 2}px solid transparent`,
						borderRight: `${HANDLE_WIDTH / 2}px solid transparent`,
						borderTop: `${HANDLE_HEIGHT}px solid ${colors.playhead}`,
					}}
				/>
			</div>
		</>
	);
}
