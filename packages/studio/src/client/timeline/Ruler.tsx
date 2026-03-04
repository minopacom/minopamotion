import React, { useRef, useEffect } from 'react';
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

export function Ruler({
	durationInFrames,
	fps,
	zoom,
	scrollLeft,
	width,
	onSeek,
}: RulerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = width * dpr;
		canvas.height = RULER_HEIGHT * dpr;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.scale(dpr, dpr);

		ctx.clearRect(0, 0, width, RULER_HEIGHT);

		const pxPerFrame = (width * zoom) / durationInFrames;

		// Decide tick intervals
		let majorInterval: number;
		if (pxPerFrame >= 8) {
			majorInterval = fps;
		} else if (pxPerFrame >= 2) {
			majorInterval = fps * 5;
		} else {
			majorInterval = fps * 10;
		}
		const minorInterval = Math.max(1, Math.floor(majorInterval / 5));

		const startFrame = Math.max(
			0,
			Math.floor(scrollLeft / pxPerFrame) - 1,
		);
		const endFrame = Math.min(
			durationInFrames,
			Math.ceil((scrollLeft + width) / pxPerFrame) + 1,
		);

		for (let f = startFrame; f <= endFrame; f++) {
			if (f % minorInterval !== 0) continue;

			const x = f * pxPerFrame - scrollLeft;
			const isMajor = f % majorInterval === 0;

			ctx.beginPath();
			ctx.moveTo(x, RULER_HEIGHT);
			ctx.lineTo(x, isMajor ? 4 : RULER_HEIGHT - 6);
			ctx.strokeStyle = isMajor ? colors.textDim : colors.textMuted;
			ctx.lineWidth = 1;
			ctx.stroke();

			if (isMajor) {
				const seconds = Math.floor(f / fps);
				const mins = Math.floor(seconds / 60);
				const secs = seconds % 60;
				const label = `${mins}:${String(secs).padStart(2, '0')}`;
				ctx.fillStyle = colors.textDim;
				ctx.font = '10px monospace';
				ctx.fillText(label, x + 3, 12);
			}
		}
	}, [durationInFrames, fps, zoom, scrollLeft, width]);

	const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left + scrollLeft;
		const pxPerFrame = (width * zoom) / durationInFrames;
		const frame = Math.round(x / pxPerFrame);
		onSeek(Math.max(0, Math.min(durationInFrames - 1, frame)));
	};

	return (
		<canvas
			ref={canvasRef}
			onClick={handleClick}
			style={{
				width,
				height: RULER_HEIGHT,
				cursor: 'pointer',
				display: 'block',
			}}
		/>
	);
}
