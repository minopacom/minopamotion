import { useRef, useCallback } from 'react';
import type { TimelineTransitionItem } from '../types.js';
import type { EditorAction } from '../editor-state.js';

interface DragState {
	transitionId: string;
	mode: 'move' | 'resize-left' | 'resize-right';
	startX: number;
	startFrom: number;
	startDuration: number;
}

export function useTransitionDrag(dispatch: React.Dispatch<EditorAction>) {
	const dragRef = useRef<DragState | null>(null);

	const onPointerMove = useCallback(
		(e: PointerEvent, pxPerFrame: number) => {
			const drag = dragRef.current;
			if (!drag) return;

			const deltaX = e.clientX - drag.startX;
			const deltaFrames = Math.round(deltaX / pxPerFrame);

			if (drag.mode === 'move') {
				// Move the transition
				const newFrom = Math.max(0, drag.startFrom + deltaFrames);
				dispatch({
					type: 'UPDATE_TIMELINE_TRANSITION',
					id: drag.transitionId,
					updates: { from: newFrom },
				});
			} else if (drag.mode === 'resize-left') {
				// Resize from the left (change start position and duration)
				const newFrom = Math.max(0, drag.startFrom + deltaFrames);
				const actualDelta = newFrom - drag.startFrom;
				const newDuration = Math.max(5, drag.startDuration - actualDelta);

				dispatch({
					type: 'UPDATE_TIMELINE_TRANSITION',
					id: drag.transitionId,
					updates: {
						from: drag.startFrom + (drag.startDuration - newDuration),
						durationInFrames: newDuration,
					},
				});
			} else if (drag.mode === 'resize-right') {
				// Resize from the right (change duration only)
				const newDuration = Math.max(5, drag.startDuration + deltaFrames);
				dispatch({
					type: 'UPDATE_TIMELINE_TRANSITION',
					id: drag.transitionId,
					updates: { durationInFrames: newDuration },
				});
			}
		},
		[dispatch],
	);

	const onPointerUp = useCallback(() => {
		if (dragRef.current) {
			dispatch({ type: 'HISTORY_COMMIT' });
			dragRef.current = null;
			document.removeEventListener('pointermove', handlePointerMove);
			document.removeEventListener('pointerup', handlePointerUp);
		}
	}, [dispatch]);

	const handlePointerMove = useCallback(
		(e: PointerEvent) => {
			const drag = dragRef.current;
			if (!drag) return;

			// Get pxPerFrame from the drag state or calculate it
			// For now, we'll pass it through a different mechanism
			onPointerMove(e, (window as any).__pxPerFrame || 2);
		},
		[onPointerMove],
	);

	const handlePointerUp = useCallback(() => {
		onPointerUp();
	}, [onPointerUp]);

	const startDrag = useCallback(
		(
			e: React.PointerEvent,
			transition: TimelineTransitionItem,
			mode: 'move' | 'resize-left' | 'resize-right',
			pxPerFrame: number,
		) => {
			e.stopPropagation();
			(e.target as HTMLElement).setPointerCapture(e.pointerId);

			// Store pxPerFrame globally for the event listeners
			(window as any).__pxPerFrame = pxPerFrame;

			dragRef.current = {
				transitionId: transition.id,
				mode,
				startX: e.clientX,
				startFrom: transition.from,
				startDuration: transition.durationInFrames,
			};

			document.addEventListener('pointermove', handlePointerMove);
			document.addEventListener('pointerup', handlePointerUp);
		},
		[handlePointerMove, handlePointerUp],
	);

	return { startDrag };
}
