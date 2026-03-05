import { interpolate, Easing } from '@minopamotion/core';
import type { Transition, EasingType, TransitionType } from '../types.js';

interface TransitionStyle {
	opacity?: number;
	transform?: string;
	clipPath?: string;
}

/**
 * Convert our EasingType to Remotion's Easing function
 */
function getEasingFunction(easingType: EasingType) {
	switch (easingType) {
		case 'linear':
			return Easing.linear;
		case 'ease':
			return Easing.ease;
		case 'ease-in':
			return Easing.in(Easing.ease);
		case 'ease-out':
			return Easing.out(Easing.ease);
		case 'ease-in-out':
			return Easing.inOut(Easing.ease);
		case 'quad':
			return Easing.quad;
		case 'cubic':
			return Easing.cubic;
		case 'bounce':
			return Easing.bounce;
		case 'elastic':
			return Easing.elastic();
		case 'back':
			return Easing.back();
		default:
			return Easing.ease;
	}
}

/**
 * Apply transition IN effect (element is appearing)
 * @param transitionType - The type of transition
 * @param progress - 0 to 1, where 0 is start of transition and 1 is fully visible
 * @returns CSS properties to apply the transition effect
 */
function applyTransitionInEffect(
	transitionType: TransitionType,
	progress: number,
): TransitionStyle {
	if (transitionType === 'none') {
		return { opacity: 1 };
	}

	switch (transitionType) {
		case 'fade':
			return { opacity: progress };

		case 'slide-left':
			return {
				opacity: progress,
				transform: `translateX(${(1 - progress) * -100}%)`,
			};

		case 'slide-right':
			return {
				opacity: progress,
				transform: `translateX(${(1 - progress) * 100}%)`,
			};

		case 'slide-up':
			return {
				opacity: progress,
				transform: `translateY(${(1 - progress) * -100}%)`,
			};

		case 'slide-down':
			return {
				opacity: progress,
				transform: `translateY(${(1 - progress) * 100}%)`,
			};

		case 'scale':
			return {
				opacity: progress,
				transform: `scale(${progress})`,
			};

		case 'zoom':
			return {
				opacity: progress,
				transform: `scale(${0.5 + progress * 0.5})`,
			};

		case 'rotate':
			return {
				opacity: progress,
				transform: `rotate(${(1 - progress) * -180}deg)`,
			};

		case 'wipe-left':
			return {
				clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)`,
			};

		case 'wipe-right':
			return {
				clipPath: `inset(0 0 0 ${(1 - progress) * 100}%)`,
			};

		default:
			return { opacity: 1 };
	}
}

/**
 * Apply transition OUT effect (element is disappearing)
 * @param transitionType - The type of transition
 * @param progress - 0 to 1, where 0 is fully visible and 1 is disappeared
 * @returns CSS properties to apply the transition effect
 */
function applyTransitionOutEffect(
	transitionType: TransitionType,
	progress: number,
): TransitionStyle {
	if (transitionType === 'none') {
		return { opacity: 1 };
	}

	const reverseProgress = 1 - progress;

	switch (transitionType) {
		case 'fade':
			return { opacity: reverseProgress };

		case 'slide-left':
			return {
				opacity: reverseProgress,
				transform: `translateX(${progress * -100}%)`,
			};

		case 'slide-right':
			return {
				opacity: reverseProgress,
				transform: `translateX(${progress * 100}%)`,
			};

		case 'slide-up':
			return {
				opacity: reverseProgress,
				transform: `translateY(${progress * -100}%)`,
			};

		case 'slide-down':
			return {
				opacity: reverseProgress,
				transform: `translateY(${progress * 100}%)`,
			};

		case 'scale':
			return {
				opacity: reverseProgress,
				transform: `scale(${reverseProgress})`,
			};

		case 'zoom':
			return {
				opacity: reverseProgress,
				transform: `scale(${0.5 + reverseProgress * 0.5})`,
			};

		case 'rotate':
			return {
				opacity: reverseProgress,
				transform: `rotate(${progress * 180}deg)`,
			};

		case 'wipe-left':
			return {
				clipPath: `inset(0 ${progress * 100}% 0 0)`,
			};

		case 'wipe-right':
			return {
				clipPath: `inset(0 0 0 ${progress * 100}%)`,
			};

		default:
			return { opacity: 1 };
	}
}

/**
 * Calculate transition styles for an element based on its transitions config
 * @param frame - Current frame number (relative to element start)
 * @param durationInFrames - Total duration of element in frames
 * @param transitionIn - Transition IN configuration
 * @param transitionOut - Transition OUT configuration
 * @returns CSS properties to apply both transitions
 */
export function calculateTransitionStyles(
	frame: number,
	durationInFrames: number,
	transitionIn: Transition | null,
	transitionOut: Transition | null,
): TransitionStyle {
	let styles: TransitionStyle = { opacity: 1 };

	// Apply transition IN
	if (transitionIn && transitionIn.type !== 'none' && frame < transitionIn.durationInFrames) {
		const progress = interpolate(
			frame,
			[0, transitionIn.durationInFrames],
			[0, 1],
			{
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
				easing: getEasingFunction(transitionIn.easing),
			},
		);
		const inStyles = applyTransitionInEffect(transitionIn.type, progress);
		styles = { ...styles, ...inStyles };
	}

	// Apply transition OUT
	if (transitionOut && transitionOut.type !== 'none') {
		const outStartFrame = durationInFrames - transitionOut.durationInFrames;
		if (frame >= outStartFrame) {
			const progress = interpolate(
				frame,
				[outStartFrame, durationInFrames],
				[0, 1],
				{
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: getEasingFunction(transitionOut.easing),
				},
			);
			const outStyles = applyTransitionOutEffect(transitionOut.type, progress);

			// Merge transforms if both transitions apply
			if (styles.transform && outStyles.transform) {
				styles.transform = `${styles.transform} ${outStyles.transform}`;
			} else if (outStyles.transform) {
				styles.transform = outStyles.transform;
			}

			// Multiply opacities if both transitions apply
			if (styles.opacity !== undefined && outStyles.opacity !== undefined) {
				styles.opacity = styles.opacity * outStyles.opacity;
			} else if (outStyles.opacity !== undefined) {
				styles.opacity = outStyles.opacity;
			}

			// Clip path from out takes precedence
			if (outStyles.clipPath) {
				styles.clipPath = outStyles.clipPath;
			}
		}
	}

	return styles;
}
