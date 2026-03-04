import { useCallback, useRef } from 'react';
import type { StudioAction } from '../../store/types.js';
import type { EditorElement } from '../types.js';

type DragMode = 'move' | 'trim-start' | 'trim-end';

interface DragState {
	elementId: string;
	mode: DragMode;
	startX: number;
	startFrom: number;
	startDuration: number;
	pxPerFrame: number;
}

interface UseTimelineDragOptions {
	dispatch: React.Dispatch<StudioAction>;
	pxPerFrame: number;
}

export function useTimelineDrag({ dispatch, pxPerFrame }: UseTimelineDragOptions) {
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
				startFrom: element.from,
				startDuration: element.durationInFrames,
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
				case 'move':
					dispatch({
						type: 'REORDER_ELEMENT',
						id: drag.elementId,
						from: Math.max(0, drag.startFrom + deltaFrames),
						durationInFrames: drag.startDuration,
					});
					break;
				case 'trim-start': {
					const newFrom = Math.max(0, drag.startFrom + deltaFrames);
					const newDuration =
						drag.startDuration - (newFrom - drag.startFrom);
					if (newDuration >= 1) {
						dispatch({
							type: 'REORDER_ELEMENT',
							id: drag.elementId,
							from: newFrom,
							durationInFrames: newDuration,
						});
					}
					break;
				}
				case 'trim-end':
					dispatch({
						type: 'REORDER_ELEMENT',
						id: drag.elementId,
						from: drag.startFrom,
						durationInFrames: Math.max(
							1,
							drag.startDuration + deltaFrames,
						),
					});
					break;
			}
		},
		[dispatch],
	);

	const onPointerUp = useCallback(
		(_e: React.PointerEvent) => {
			if (dragRef.current) {
				dragRef.current = null;
				dispatch({ type: 'HISTORY_COMMIT' });
			}
		},
		[dispatch],
	);

	return { startDrag, onPointerMove, onPointerUp };
}
