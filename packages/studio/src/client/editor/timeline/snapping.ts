import type { EditorElement } from '../types.js';

export interface SnapPoint {
	frame: number;
	type: 'element-start' | 'element-end' | 'playhead' | 'grid';
	elementId?: string;
}

export interface SnapResult {
	snappedFrame: number;
	snapPoint: SnapPoint | null;
}

const SNAP_THRESHOLD = 15; // frames - increased for better UX

/**
 * Calculates snapping for timeline dragging.
 * Returns the snapped frame and which snap point was used.
 */
export function calculateTimelineSnap(
	targetFrame: number,
	elements: EditorElement[],
	currentElementId: string | null,
	playheadFrame: number,
	options: {
		enabled: boolean;
		snapToElements?: boolean;
		snapToPlayhead?: boolean;
		snapToGrid?: boolean;
		gridInterval?: number;
	},
): SnapResult {
	if (!options.enabled) {
		return { snappedFrame: targetFrame, snapPoint: null };
	}

	const snapPoints: SnapPoint[] = [];

	// Collect snap points from other elements
	if (options.snapToElements !== false) {
		elements.forEach((el) => {
			// Don't snap to self
			if (el.id === currentElementId) return;

			// Element start
			snapPoints.push({
				frame: el.from,
				type: 'element-start',
				elementId: el.id,
			});

			// Element end
			snapPoints.push({
				frame: el.from + el.durationInFrames,
				type: 'element-end',
				elementId: el.id,
			});
		});
	}

	// Playhead snap point
	if (options.snapToPlayhead !== false) {
		snapPoints.push({
			frame: playheadFrame,
			type: 'playhead',
		});
	}

	// Grid snap points (every N frames)
	if (options.snapToGrid !== false) {
		const gridInterval = options.gridInterval || 10;
		const nearestGrid = Math.round(targetFrame / gridInterval) * gridInterval;
		snapPoints.push({
			frame: nearestGrid,
			type: 'grid',
		});
	}

	// Find closest snap point within threshold
	let closestSnap: SnapPoint | null = null;
	let closestDistance = SNAP_THRESHOLD;

	snapPoints.forEach((point) => {
		const distance = Math.abs(targetFrame - point.frame);
		if (distance < closestDistance) {
			closestDistance = distance;
			closestSnap = point;
		}
	});

	if (closestSnap) {
		return {
			snappedFrame: closestSnap.frame,
			snapPoint: closestSnap,
		};
	}

	return { snappedFrame: targetFrame, snapPoint: null };
}

/**
 * Calculates snapping for element duration (trim handles).
 * Snaps the end position while keeping start fixed.
 */
export function calculateDurationSnap(
	startFrame: number,
	targetEndFrame: number,
	elements: EditorElement[],
	currentElementId: string | null,
	playheadFrame: number,
	options: {
		enabled: boolean;
		snapToElements?: boolean;
		snapToPlayhead?: boolean;
	},
): SnapResult {
	if (!options.enabled) {
		return { snappedFrame: targetEndFrame, snapPoint: null };
	}

	const snapPoints: SnapPoint[] = [];

	// Collect snap points from other elements
	if (options.snapToElements !== false) {
		elements.forEach((el) => {
			if (el.id === currentElementId) return;

			snapPoints.push({
				frame: el.from,
				type: 'element-start',
				elementId: el.id,
			});

			snapPoints.push({
				frame: el.from + el.durationInFrames,
				type: 'element-end',
				elementId: el.id,
			});
		});
	}

	// Playhead snap point
	if (options.snapToPlayhead !== false) {
		snapPoints.push({
			frame: playheadFrame,
			type: 'playhead',
		});
	}

	// Find closest snap point
	let closestSnap: SnapPoint | null = null;
	let closestDistance = SNAP_THRESHOLD;

	snapPoints.forEach((point) => {
		const distance = Math.abs(targetEndFrame - point.frame);
		if (distance < closestDistance) {
			closestDistance = distance;
			closestSnap = point;
		}
	});

	if (closestSnap) {
		// Ensure duration is at least 1 frame
		const snappedEnd = Math.max(closestSnap.frame, startFrame + 1);
		return {
			snappedFrame: snappedEnd,
			snapPoint: closestSnap,
		};
	}

	return { snappedFrame: targetEndFrame, snapPoint: null };
}
