import { useCallback, useRef } from 'react';
import type { StudioAction } from '../../store/types.js';
import type { EditorElement } from '../types.js';
import {
	calculateTimelineSnap,
	calculateDurationSnap,
} from './snapping.js';
import { createEditorTrack } from '../defaults.js';

type DragMode = 'move' | 'trim-start' | 'trim-end';

interface DragState {
	elementId: string;
	mode: DragMode;
	startX: number;
	startY: number;
	startFrom: number;
	startDuration: number;
	startTrackId: string;
	pxPerFrame: number;
	targetTrackId?: string; // Track ID to move to on pointer up
	needsNewTrackAbove?: boolean; // Flag to create track above on pointer up
	needsNewTrackBelow?: boolean; // Flag to create track below on pointer up
	previewFrame?: number; // Preview frame position during drag
	previewTrackIndex?: number; // Preview track index during drag
}

interface UseTimelineDragOptions {
	dispatch: React.Dispatch<StudioAction>;
	pxPerFrame: number;
	snappingEnabled: boolean;
	elements: EditorElement[];
	playheadFrame: number;
	tracks: Array<{ id: string }>;
	gridSnapInterval?: number;
}

export function useTimelineDrag({
	dispatch,
	pxPerFrame,
	snappingEnabled,
	elements,
	playheadFrame,
	tracks,
	gridSnapInterval = 10,
}: UseTimelineDragOptions) {
	const dragRef = useRef<DragState | null>(null);

	const startDrag = useCallback(
		(e: React.PointerEvent, element: EditorElement, mode: DragMode) => {
			e.preventDefault();
			e.stopPropagation();
			(e.target as HTMLElement).setPointerCapture(e.pointerId);

			dragRef.current = {
				elementId: element.id,
				mode,
				startX: e.clientX,
				startY: e.clientY,
				startFrom: element.from,
				startDuration: element.durationInFrames,
				startTrackId: element.trackId,
				pxPerFrame,
			};
		},
		[pxPerFrame],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent) => {
			const drag = dragRef.current;
			if (!drag) return;

			const deltaFrames = Math.round(
				(e.clientX - drag.startX) / drag.pxPerFrame,
			);

			switch (drag.mode) {
				case 'move': {
					const targetFrame = Math.max(0, drag.startFrom + deltaFrames);
					const { snappedFrame } = calculateTimelineSnap(
						targetFrame,
						elements,
						drag.elementId,
						playheadFrame,
						{
							enabled: snappingEnabled,
							snapToElements: true,
							snapToPlayhead: true,
							snapToGrid: true,
							gridInterval: gridSnapInterval,
						},
					);

					// Calculate target track based on vertical movement
					const TRACK_HEIGHT = 60; // px per track (matches LANE_HEIGHT in EditorTrackLane.tsx)
					const deltaY = e.clientY - drag.startY;
					const trackDelta = Math.round(deltaY / TRACK_HEIGHT);
					const currentTrackIndex = tracks.findIndex(
						(t) => t.id === drag.startTrackId,
					);
const rawTargetIndex = currentTrackIndex + trackDelta;

				// Determine target track - clamp to existing tracks during drag
				let targetTrackId: string;
				if (rawTargetIndex < 0) {
					// Store flag to create track above on pointer up
					drag.needsNewTrackAbove = true;
					drag.needsNewTrackBelow = false;
					// For now, show on first track
					targetTrackId = tracks[0]?.id || drag.startTrackId;
				} else if (rawTargetIndex >= tracks.length) {
					// Store flag to create track below on pointer up
					drag.needsNewTrackAbove = false;
					drag.needsNewTrackBelow = true;
					// For now, show on last track
					targetTrackId = tracks[tracks.length - 1]?.id || drag.startTrackId;
				} else {
					// Use existing track - update in real-time
					drag.needsNewTrackAbove = false;
					drag.needsNewTrackBelow = false;
					targetTrackId = tracks[rawTargetIndex].id;
				}

				drag.targetTrackId = targetTrackId;
				drag.previewFrame = snappedFrame;
				drag.previewTrackIndex = rawTargetIndex;

				// During drag, only update horizontal position, NOT track
				// Track changes happen on pointer up for smooth free-form drag
				dispatch({
					type: 'REORDER_ELEMENT',
					id: drag.elementId,
					from: snappedFrame,
					durationInFrames: drag.startDuration,
					// Don't change trackId during drag - element stays on original track visually
				});
					break;
				}
				case 'trim-start': {
					const targetFrom = Math.max(0, drag.startFrom + deltaFrames);
					const { snappedFrame } = calculateTimelineSnap(
						targetFrom,
						elements,
						drag.elementId,
						playheadFrame,
						{
							enabled: snappingEnabled,
							snapToElements: true,
							snapToPlayhead: true,
							snapToGrid: false,
						},
					);
					const newDuration =
						drag.startDuration - (snappedFrame - drag.startFrom);
					if (newDuration >= 1) {
						dispatch({
							type: 'REORDER_ELEMENT',
							id: drag.elementId,
							from: snappedFrame,
							durationInFrames: newDuration,
						});
					}
					break;
				}
				case 'trim-end': {
					const targetEnd =
						drag.startFrom + Math.max(1, drag.startDuration + deltaFrames);
					const { snappedFrame } = calculateDurationSnap(
						drag.startFrom,
						targetEnd,
						elements,
						drag.elementId,
						playheadFrame,
						{
							enabled: snappingEnabled,
							snapToElements: true,
							snapToPlayhead: true,
						},
					);
					dispatch({
						type: 'REORDER_ELEMENT',
						id: drag.elementId,
						from: drag.startFrom,
						durationInFrames: Math.max(1, snappedFrame - drag.startFrom),
					});
					break;
				}
			}
		},
		[dispatch, elements, playheadFrame, snappingEnabled, tracks],
	);

	const onPointerUp = useCallback(
		(_e: React.PointerEvent) => {
			const drag = dragRef.current;
			if (drag) {
				const elementId = drag.elementId;
				const startTrackId = drag.startTrackId;
				let finalTrackId = drag.targetTrackId || startTrackId;

				// Handle track creation if needed (only expensive operations here)
				if (drag.needsNewTrackAbove) {
					const newTrack = createEditorTrack({
						name: `Track ${tracks.length + 1}`,
					});
					dispatch({ type: 'ADD_EDITOR_TRACK', track: newTrack });
					dispatch({
						type: 'REORDER_TRACKS',
						fromIndex: tracks.length,
						toIndex: 0,
					});
					finalTrackId = newTrack.id;


				} else if (drag.needsNewTrackBelow) {
					const newTrack = createEditorTrack({
						name: `Track ${tracks.length + 1}`,
					});
					dispatch({ type: 'ADD_EDITOR_TRACK', track: newTrack });
					finalTrackId = newTrack.id;
				}

				// Move element to the final track (whether new or existing)
				if (finalTrackId !== startTrackId) {
					const element = elements.find((el) => el.id === elementId);
					if (element) {
						dispatch({
							type: 'REORDER_ELEMENT',
							id: elementId,
							from: element.from,
							durationInFrames: element.durationInFrames,
							trackId: finalTrackId,
						});
					}
				}

				// Auto-remove empty tracks (but not the track we just moved to)
				tracks.forEach((track) => {
					if (track.id === finalTrackId) return; // Don't remove destination track
					const hasElements = elements.some(
						(el) => el.trackId === track.id && el.id !== elementId,
					);
					if (!hasElements) {
						dispatch({ type: 'REMOVE_EDITOR_TRACK', trackId: track.id });
					}
				});

				dragRef.current = null;
				dispatch({ type: 'HISTORY_COMMIT' });
			}
		},
		[dispatch, tracks, elements],
	);

	return {
		startDrag,
		onPointerMove,
		onPointerUp,
		dragState: dragRef.current, // Expose drag state for visual feedback
	};
}
