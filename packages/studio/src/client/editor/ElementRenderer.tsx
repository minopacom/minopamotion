import React from 'react';
import { useCurrentFrame } from '@minopamotion/core';
import type { EditorElement, TimelineTransitionItem } from './types.js';
import { TextRenderer } from './TextRenderer.js';
import { SolidRenderer } from './SolidRenderer.js';
import { ImageRenderer } from './ImageRenderer.js';
import { VideoRenderer } from './VideoRenderer.js';
import { AudioRenderer } from './AudioRenderer.js';
import { CaptionRenderer } from './CaptionRenderer.js';
import { calculateTransitionStyles } from './transitions/apply-transition.js';
import { calculateTimelineTransitionEffect } from './transitions/apply-timeline-transition.js';

interface ElementRendererProps {
	element: EditorElement;
	fps: number;
	timelineTransitions: TimelineTransitionItem[];
}

export function ElementRenderer({ element, fps, timelineTransitions }: ElementRendererProps) {
	const { transform, transitions, durationInFrames } = element;

	// Get current frame relative to this element (thanks to Sequence wrapper)
	const frame = useCurrentFrame();

	// Calculate absolute timeline frame
	const absoluteFrame = element.from + frame;

	// Calculate transition styles based on current frame (element-level transitions)
	const transitionStyles = calculateTransitionStyles(
		frame,
		durationInFrames,
		transitions.in,
		transitions.out,
	);

	// Calculate timeline transition effects (manually added transitions)
	const timelineTransitionStyle = calculateTimelineTransitionEffect(
		element,
		absoluteFrame,
		timelineTransitions,
	);

	// Merge base transform with transition effects
	const baseTransform = transform.rotation ? `rotate(${transform.rotation}deg)` : '';
	const elementTransform = transitionStyles.transform || '';
	const timelineTransform = timelineTransitionStyle.transform || '';

	const combinedTransform = [baseTransform, elementTransform, timelineTransform]
		.filter(Boolean)
		.join(' ')
		.trim() || undefined;

	// Combine all opacity sources: element transform * element transition * timeline transition
	const finalOpacity = transform.opacity *
		(transitionStyles.opacity ?? 1) *
		(timelineTransitionStyle.opacity ?? 1);

	// Merge clip paths (prefer timeline transition clipPath if present)
	const finalClipPath = timelineTransitionStyle.clipPath || transitionStyles.clipPath;

	return (
		<div
			data-element-id={element.id}
			style={{
				position: 'absolute',
				left: transform.x,
				top: transform.y,
				width: transform.width,
				height: transform.height,
				transform: combinedTransform,
				opacity: finalOpacity,
				clipPath: finalClipPath,
				pointerEvents: 'none',
			}}
		>
			{element.type === 'text' && <TextRenderer element={element} />}
			{element.type === 'solid' && <SolidRenderer element={element} />}
			{element.type === 'image' && <ImageRenderer element={element} />}
			{element.type === 'video' && <VideoRenderer element={element} fps={fps} />}
			{element.type === 'audio' && <AudioRenderer element={element} fps={fps} />}
			{element.type === 'caption' && <CaptionRenderer element={element} />}
		</div>
	);
}
