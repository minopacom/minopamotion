import React from 'react';
import { colors } from '../utils/colors.js';

interface InOutMarkersProps {
	inPoint: number | null;
	outPoint: number | null;
	durationInFrames: number;
	zoom: number;
	scrollLeft: number;
	width: number;
	height: number;
}

export function InOutMarkers({
	inPoint,
	outPoint,
	durationInFrames,
	zoom,
	scrollLeft,
	width,
	height,
}: InOutMarkersProps) {
	if (inPoint === null && outPoint === null) return null;

	const pxPerFrame = (width * zoom) / durationInFrames;

	const inX =
		inPoint !== null
			? inPoint * pxPerFrame - scrollLeft
			: -scrollLeft;
	const outX =
		outPoint !== null
			? outPoint * pxPerFrame - scrollLeft
			: durationInFrames * pxPerFrame - scrollLeft;

	return (
		<>
			{/* Before in-point dimming */}
			{inPoint !== null && inX > 0 && (
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						width: Math.min(inX, width),
						height,
						background: 'rgba(0, 0, 0, 0.4)',
						pointerEvents: 'none',
						zIndex: 5,
					}}
				/>
			)}
			{/* After out-point dimming */}
			{outPoint !== null && outX < width && (
				<div
					style={{
						position: 'absolute',
						left: Math.max(0, outX),
						top: 0,
						width: width - Math.max(0, outX),
						height,
						background: 'rgba(0, 0, 0, 0.4)',
						pointerEvents: 'none',
						zIndex: 5,
					}}
				/>
			)}
			{/* In marker */}
			{inPoint !== null && inX >= 0 && inX <= width && (
				<div
					style={{
						position: 'absolute',
						left: inX,
						top: 0,
						width: 2,
						height,
						background: colors.accentLight,
						pointerEvents: 'none',
						zIndex: 6,
					}}
				>
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: -1,
							fontSize: 8,
							color: colors.accentLight,
							fontWeight: 700,
						}}
					>
						I
					</div>
				</div>
			)}
			{/* Out marker */}
			{outPoint !== null && outX >= 0 && outX <= width && (
				<div
					style={{
						position: 'absolute',
						left: outX,
						top: 0,
						width: 2,
						height,
						background: colors.accentLight,
						pointerEvents: 'none',
						zIndex: 6,
					}}
				>
					<div
						style={{
							position: 'absolute',
							top: 0,
							right: -1,
							fontSize: 8,
							color: colors.accentLight,
							fontWeight: 700,
						}}
					>
						O
					</div>
				</div>
			)}
		</>
	);
}
