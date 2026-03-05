import React, { useMemo } from 'react';
import { AbsoluteFill, Sequence } from '@minopamotion/core';
import { useStudioState } from '../store/context.js';
import { ElementRenderer } from './ElementRenderer.js';
import type { EditorElement, TimelineTransitionItem } from './types.js';

export function EditorComposition() {
	const { editorScene } = useStudioState();
	const { elements, tracks, settings, timelineTransitions } = editorScene;

	// Build track order map: first track = bottom, last = top
	const trackOrder = new Map<string, number>();
	tracks.forEach((t, i) => trackOrder.set(t.id, i));

	// Filter visible elements and sort by track order (bottom first)
	const visibleTrackIds = new Set(
		tracks.filter((t) => t.visible).map((t) => t.id),
	);

	const sortedElements = elements
		.filter((el) => visibleTrackIds.has(el.trackId))
		.sort(
			(a, b) =>
				(trackOrder.get(a.trackId) ?? 0) -
				(trackOrder.get(b.trackId) ?? 0),
		);

	return (
		<AbsoluteFill>
			{sortedElements.map((element) => (
				<ElementSequenceWrapper
					key={element.id}
					element={element}
					fps={settings.fps}
					timelineTransitions={timelineTransitions}
				/>
			))}
		</AbsoluteFill>
	);
}

function ElementSequenceWrapper({
	element,
	fps,
	timelineTransitions,
}: {
	element: EditorElement;
	fps: number;
	timelineTransitions: TimelineTransitionItem[];
}) {
	return (
		<Sequence
			from={element.from}
			durationInFrames={element.durationInFrames}
			name={element.name}
		>
			<ElementRenderer
				element={element}
				fps={fps}
				timelineTransitions={timelineTransitions}
			/>
		</Sequence>
	);
}
