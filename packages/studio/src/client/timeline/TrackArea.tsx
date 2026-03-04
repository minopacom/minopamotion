import React from 'react';
import type { TrackDefinition } from '../store/types.js';
import { TrackLane } from './TrackLane.js';

interface TrackAreaProps {
	tracks: TrackDefinition[];
	durationInFrames: number;
	zoom: number;
	scrollLeft: number;
	width: number;
}

export function TrackArea({
	tracks,
	durationInFrames,
	zoom,
	scrollLeft,
	width,
}: TrackAreaProps) {
	return (
		<div style={{ padding: '4px 0', flex: 1, overflowY: 'auto' }}>
			{tracks.map((track, i) => (
				<TrackLane
					key={track.id}
					track={track}
					durationInFrames={durationInFrames}
					zoom={zoom}
					scrollLeft={scrollLeft}
					width={width}
					colorIndex={i}
				/>
			))}
		</div>
	);
}
