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
const TRACK_HEADER_WIDTH = 140; // Width of the track header on the left

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

	// Canvas width should exclude track header width
	const canvasWidth = width - TRACK_HEADER_WIDTH;
	const totalCanvasWidth = canvasWidth * zoom;
	const pxPerFrame = totalCanvasWidth / durationInFrames;
	const x = TRACK_HEADER_WIDTH + currentFrame * pxPerFrame - scrollLeft;

	const frameFromClientX = useCallback(
		(clientX: number, containerLeft: number) => {
			const relX = clientX - containerLeft - TRACK_HEADER_WIDTH + scrollLeft;
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

	// Check if playhead is visible (account for track header offset)
	if (x < TRACK_HEADER_WIDTH - HANDLE_WIDTH || x > width + HANDLE_WIDTH) return null;

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				pointerEvents: 'none',
				zIndex: 100,
			}}
		>
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
					pointerEvents: 'auto',
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
		</div>
	);
}
