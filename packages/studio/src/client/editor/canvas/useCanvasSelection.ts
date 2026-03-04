import { useCallback } from 'react';
import type { EditorElement } from '../types.js';
import type { StudioAction } from '../../store/types.js';
import { pointInRotatedRect } from './hit-test.js';

interface UseCanvasSelectionOptions {
	elements: EditorElement[];
	trackOrder: Map<string, number>;
	dispatch: React.Dispatch<StudioAction>;
	scale: number;
	offsetX: number;
	offsetY: number;
}

export function useCanvasSelection({
	elements,
	trackOrder,
	dispatch,
	scale,
	offsetX,
	offsetY,
}: UseCanvasSelectionOptions) {
	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			const rect = e.currentTarget.getBoundingClientRect();
			const px = (e.clientX - rect.left - offsetX) / scale;
			const py = (e.clientY - rect.top - offsetY) / scale;

			// Iterate top-to-bottom (highest track first) to find topmost hit
			const sorted = [...elements].sort(
				(a, b) =>
					(trackOrder.get(b.trackId) ?? 0) -
					(trackOrder.get(a.trackId) ?? 0),
			);

			for (const el of sorted) {
				if (pointInRotatedRect(px, py, el.transform)) {
					dispatch({
						type: 'SELECT_ELEMENTS',
						ids: [el.id],
						append: e.shiftKey,
					});
					return;
				}
			}

			// Clicked empty space
			dispatch({ type: 'DESELECT_ALL' });
		},
		[elements, trackOrder, dispatch, scale, offsetX, offsetY],
	);

	return { handleClick };
}
