import React, { useRef, useEffect, useCallback } from 'react';
import { colors } from '../utils/colors.js';

interface RulerProps {
	durationInFrames: number;
	fps: number;
	zoom: number;
	scrollLeft: number;
	width: number;
	onSeek: (frame: number) => void;
}

const RULER_HEIGHT = 24;
const TRACK_HEADER_WIDTH = 140;

export function Ruler({
	durationInFrames,
	fps,
	zoom,
	scrollLeft,
	width,
	onSeek,
}: RulerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Canvas width should be viewport width minus track header
	const canvasWidth = width - TRACK_HEADER_WIDTH;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = canvasWidth * dpr;
		canvas.height = RULER_HEIGHT * dpr;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.scale(dpr, dpr);

		ctx.clearRect(0, 0, canvasWidth, RULER_HEIGHT);

		// Calculate pixels per frame for the canvas width (excluding track header)
		const totalCanvasWidth = canvasWidth * zoom;
		const pxPerFrame = totalCanvasWidth / durationInFrames;
		const totalSeconds = durationInFrames / fps;

		// Determine time interval based on zoom level
		let timeInterval: number; // in seconds
		const visibleSeconds = (canvasWidth / pxPerFrame) / fps;

		if (visibleSeconds < 10) {
			timeInterval = 1; // Every 1 second
		} else if (visibleSeconds < 30) {
			timeInterval = 5; // Every 5 seconds
		} else if (visibleSeconds < 120) {
			timeInterval = 10; // Every 10 seconds
		} else if (visibleSeconds < 300) {
			timeInterval = 30; // Every 30 seconds
		} else {
			timeInterval = 60; // Every minute
		}

		// Calculate which seconds are visible in the current scroll view
		const startVisibleSecond = (scrollLeft / pxPerFrame) / fps;
		const endVisibleSecond = ((scrollLeft + canvasWidth) / pxPerFrame) / fps;

		// Start from the first interval before visible area
		const startSeconds = Math.floor(startVisibleSecond / timeInterval) * timeInterval;
		const endSeconds = Math.ceil(endVisibleSecond / timeInterval) * timeInterval;

		// Draw time markers
		for (let sec = startSeconds; sec <= Math.min(endSeconds, totalSeconds); sec += timeInterval) {
			const frame = sec * fps;
			const x = frame * pxPerFrame - scrollLeft;

			// Only draw if in visible canvas area
			if (x < -50 || x > canvasWidth + 50) continue;

			// Draw tick mark
			ctx.beginPath();
			ctx.moveTo(x, RULER_HEIGHT);
			ctx.lineTo(x, 4);
			ctx.strokeStyle = colors.textDim;
			ctx.lineWidth = 1;
			ctx.stroke();

			// Draw time label
			const mins = Math.floor(sec / 60);
			const secs = sec % 60;
			const label = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
			ctx.fillStyle = colors.text;
			ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
			ctx.fillText(label, x + 4, 13);
		}

		// Draw minor tick marks
		const minorInterval = timeInterval <= 5 ? 1 : 5;
		for (let sec = startSeconds; sec <= Math.min(endSeconds, totalSeconds); sec += minorInterval) {
			if (sec % timeInterval === 0) continue; // Skip major ticks

			const frame = sec * fps;
			const x = frame * pxPerFrame - scrollLeft;

			if (x < 0 || x > canvasWidth) continue;

			ctx.beginPath();
			ctx.moveTo(x, RULER_HEIGHT);
			ctx.lineTo(x, RULER_HEIGHT - 6);
			ctx.strokeStyle = colors.border;
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}, [durationInFrames, fps, zoom, scrollLeft, width, canvasWidth]);

	const frameFromClientX = useCallback(
		(clientX: number) => {
			const canvas = canvasRef.current;
			if (!canvas) return 0;
			const rect = canvas.getBoundingClientRect();
			const x = clientX - rect.left + scrollLeft;
			const canvasWidth = width - TRACK_HEADER_WIDTH;
			const totalCanvasWidth = canvasWidth * zoom;
			const pxPerFrame = totalCanvasWidth / durationInFrames;
			const frame = Math.round(x / pxPerFrame);
			return Math.max(0, Math.min(durationInFrames - 1, frame));
		},
		[scrollLeft, width, zoom, durationInFrames],
	);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			e.preventDefault();
			const canvas = canvasRef.current;
			if (!canvas) return;

			// Seek immediately on mouse down
			onSeek(frameFromClientX(e.clientX));

			const handleMouseMove = (ev: MouseEvent) => {
				onSeek(frameFromClientX(ev.clientX));
			};

			const handleMouseUp = () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseup', handleMouseUp);
			};

			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		},
		[frameFromClientX, onSeek],
	);

	return (
		<div
			style={{
				marginLeft: TRACK_HEADER_WIDTH,
				background: colors.bgPanel,
			}}
		>
			<canvas
				ref={canvasRef}
				onMouseDown={handleMouseDown}
				style={{
					width: canvasWidth,
					height: RULER_HEIGHT,
					cursor: 'pointer',
					display: 'block',
					borderRadius: '4px 4px 0 0',
				}}
			/>
		</div>
	);
}
