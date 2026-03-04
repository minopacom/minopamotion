import React from 'react';
import type { TrackDefinition } from '../store/types.js';
import { colors } from '../utils/colors.js';

interface TrackLaneProps {
	track: TrackDefinition;
	durationInFrames: number;
	zoom: number;
	scrollLeft: number;
	width: number;
	colorIndex: number;
}

const LANE_HEIGHT = 28;

export function TrackLane({
	track,
	durationInFrames,
	zoom,
	scrollLeft,
	width,
	colorIndex,
}: TrackLaneProps) {
	const pxPerFrame = (width * zoom) / durationInFrames;
	const left = track.from * pxPerFrame - scrollLeft;
	const barWidth = track.durationInFrames * pxPerFrame;
	const trackColor =
		track.color ??
		colors.trackColors[colorIndex % colors.trackColors.length];

	if (left + barWidth < 0 || left > width) return null;

	return (
		<div
			style={{
				height: LANE_HEIGHT,
				position: 'relative',
				marginBottom: 2,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: Math.max(0, left),
					width: Math.min(
						barWidth - Math.max(0, -left),
						width - Math.max(0, left),
					),
					height: LANE_HEIGHT,
					background: trackColor,
					borderRadius: 4,
					opacity: 0.8,
					display: 'flex',
					alignItems: 'center',
					paddingLeft: 8,
					overflow: 'hidden',
					whiteSpace: 'nowrap',
				}}
				title={`${track.label} (${track.from}-${track.from + track.durationInFrames})`}
			>
				<span
					style={{
						fontSize: 11,
						color: '#fff',
						fontWeight: 500,
						textShadow: '0 1px 2px rgba(0,0,0,0.5)',
					}}
				>
					{track.label}
				</span>
			</div>
		</div>
	);
}
