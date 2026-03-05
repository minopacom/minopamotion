import { interpolate, Easing } from '@minopamotion/core';
import type { EditorElement, TimelineTransitionItem } from '../types.js';

export interface TimelineTransitionStyle {
	opacity?: number;
	transform?: string;
	clipPath?: string;
}

/**
 * Calculate transition effect for an element based on timeline transitions.
 * Returns style overrides to apply the transition effect.
 */
export function calculateTimelineTransitionEffect(
	element: EditorElement,
	absoluteFrame: number,
	transitions: TimelineTransitionItem[],
): TimelineTransitionStyle {
	// Find transitions that affect this element
	const activeTransitions = transitions.filter((t) => {
		const transitionEnd = t.from + t.durationInFrames;
		const isInTimeRange = absoluteFrame >= t.from && absoluteFrame < transitionEnd;

		// Check if this element is involved in the transition
		const isInvolved =
			t.beforeElementId === element.id ||
			t.afterElementId === element.id ||
			// If no specific elements, affect all elements in this time range on this track
			(!t.beforeElementId && !t.afterElementId && t.trackId === element.trackId);

		return isInTimeRange && isInvolved;
	});

	if (activeTransitions.length === 0) {
		return {}; // No transition affecting this element
	}

	// Apply the first active transition (for now, we'll handle one at a time)
	const transition = activeTransitions[0];
	const progress = (absoluteFrame - transition.from) / transition.durationInFrames;
	const easedProgress = interpolate(progress, [0, 1], [0, 1], {
		easing: Easing.ease,
	});

	// Determine if this element is fading in or out
	const isFadingOut = transition.beforeElementId === element.id;
	const isFadingIn = transition.afterElementId === element.id;

	// If no specific elements are set, check element timing
	let shouldFadeOut = isFadingOut;
	let shouldFadeIn = isFadingIn;

	if (!transition.beforeElementId && !transition.afterElementId) {
		// Generic transition on track - check if element overlaps with transition
		const elementEnd = element.from + element.durationInFrames;
		const transitionEnd = transition.from + transition.durationInFrames;

		// Element is ending during transition
		if (element.from < transition.from && elementEnd > transition.from) {
			shouldFadeOut = true;
		}
		// Element is starting during transition
		if (element.from >= transition.from && element.from < transitionEnd) {
			shouldFadeIn = true;
		}
	}

	return applyTransitionEffect(
		transition.effect,
		easedProgress,
		shouldFadeOut,
		shouldFadeIn,
	);
}

function applyTransitionEffect(
	effect: string,
	progress: number,
	isFadingOut: boolean,
	isFadingIn: boolean,
): TimelineTransitionStyle {
	const effectiveProgress = isFadingOut ? progress : 1 - progress;

	switch (effect) {
		case 'crossfade':
		case 'dissolve':
			return {
				opacity: isFadingOut ? 1 - progress : progress,
			};

		case 'wipe-left': {
			const clipProgress = isFadingOut ? progress * 100 : (1 - progress) * 100;
			return {
				clipPath: `inset(0 ${clipProgress}% 0 0)`,
			};
		}

		case 'wipe-right': {
			const clipProgress = isFadingOut ? progress * 100 : (1 - progress) * 100;
			return {
				clipPath: `inset(0 0 0 ${clipProgress}%)`,
			};
		}

		case 'wipe-up': {
			const clipProgress = isFadingOut ? progress * 100 : (1 - progress) * 100;
			return {
				clipPath: `inset(${clipProgress}% 0 0 0)`,
			};
		}

		case 'wipe-down': {
			const clipProgress = isFadingOut ? progress * 100 : (1 - progress) * 100;
			return {
				clipPath: `inset(0 0 ${clipProgress}% 0)`,
			};
		}

		case 'slide-left': {
			const translateX = isFadingOut ? -progress * 100 : (1 - progress) * 100;
			return {
				transform: `translateX(${translateX}%)`,
				opacity: isFadingOut ? 1 - progress : progress,
			};
		}

		case 'slide-right': {
			const translateX = isFadingOut ? progress * 100 : -(1 - progress) * 100;
			return {
				transform: `translateX(${translateX}%)`,
				opacity: isFadingOut ? 1 - progress : progress,
			};
		}

		case 'zoom-in': {
			const scale = isFadingOut ? 1 - progress * 0.5 : 0.5 + progress * 0.5;
			return {
				transform: `scale(${scale})`,
				opacity: isFadingOut ? 1 - progress : progress,
			};
		}

		case 'zoom-out': {
			const scale = isFadingOut ? 1 + progress * 0.5 : 1.5 - progress * 0.5;
			return {
				transform: `scale(${scale})`,
				opacity: isFadingOut ? 1 - progress : progress,
			};
		}

		default:
			return {
				opacity: isFadingOut ? 1 - progress : progress,
			};
	}
}
