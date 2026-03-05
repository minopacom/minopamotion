import type { EditorElement } from '../types.js';

/**
 * Represents a transition zone where two clips overlap on the timeline
 */
export interface TimelineTransition {
	/** The element that's fading out */
	outgoingElement: EditorElement;
	/** The element that's fading in */
	incomingElement: EditorElement;
	/** Frame where transition starts (absolute timeline frame) */
	startFrame: number;
	/** Frame where transition ends (absolute timeline frame) */
	endFrame: number;
	/** Duration of the transition in frames */
	durationInFrames: number;
}

/**
 * Detect overlapping clips on the same track and create transition zones
 */
export function detectTimelineTransitions(
	elements: EditorElement[],
	trackId: string,
): TimelineTransition[] {
	const transitions: TimelineTransition[] = [];

	// Get all elements on this track, sorted by start time
	const trackElements = elements
		.filter((el) => el.trackId === trackId)
		.sort((a, b) => a.from - b.from);

	// Check each pair of consecutive elements for overlap
	for (let i = 0; i < trackElements.length - 1; i++) {
		const current = trackElements[i];
		const next = trackElements[i + 1];

		const currentEnd = current.from + current.durationInFrames;
		const nextStart = next.from;

		// If current element extends beyond next element's start, they overlap
		if (currentEnd > nextStart) {
			const overlapStart = nextStart;
			const overlapEnd = Math.min(currentEnd, next.from + next.durationInFrames);
			const overlapDuration = overlapEnd - overlapStart;

			transitions.push({
				outgoingElement: current,
				incomingElement: next,
				startFrame: overlapStart,
				endFrame: overlapEnd,
				durationInFrames: overlapDuration,
			});
		}
	}

	return transitions;
}

/**
 * Calculate opacity for an element involved in a timeline transition
 * @param element - The element being rendered
 * @param absoluteFrame - Current absolute timeline frame
 * @param transitions - All timeline transitions on this track
 * @returns Opacity multiplier (0-1) to apply for crossfade
 */
export function calculateTimelineTransitionOpacity(
	element: EditorElement,
	absoluteFrame: number,
	transitions: TimelineTransition[],
): number {
	// Check if this element is involved in any transition at the current frame
	for (const transition of transitions) {
		// Only apply if we're in the transition zone
		if (absoluteFrame < transition.startFrame || absoluteFrame >= transition.endFrame) {
			continue;
		}

		// Calculate progress through the transition (0 to 1)
		const progress =
			(absoluteFrame - transition.startFrame) / transition.durationInFrames;

		// If this element is fading out
		if (transition.outgoingElement.id === element.id) {
			return 1 - progress; // Fade from 1 to 0
		}

		// If this element is fading in
		if (transition.incomingElement.id === element.id) {
			return progress; // Fade from 0 to 1
		}
	}

	// No transition affecting this element at this frame
	return 1;
}

/**
 * Check if an element is currently in a timeline transition zone
 */
export function isInTimelineTransition(
	element: EditorElement,
	absoluteFrame: number,
	transitions: TimelineTransition[],
): boolean {
	return transitions.some(
		(t) =>
			absoluteFrame >= t.startFrame &&
			absoluteFrame < t.endFrame &&
			(t.outgoingElement.id === element.id || t.incomingElement.id === element.id),
	);
}
