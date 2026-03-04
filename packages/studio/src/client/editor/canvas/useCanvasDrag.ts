import { useCallback, useRef } from 'react';
import type { StudioAction } from '../../store/types.js';
import type { EditorElement, Transform } from '../types.js';

export type HandlePosition =
	| 'nw'
	| 'n'
	| 'ne'
	| 'e'
	| 'se'
	| 's'
	| 'sw'
	| 'w'
	| 'rotate';

interface DragState {
	elementId: string;
	startX: number;
	startY: number;
	startTransform: Transform;
	handle: HandlePosition | 'move';
}

interface UseCanvasDragOptions {
	dispatch: React.Dispatch<StudioAction>;
	scale: number;
}

export function useCanvasDrag({ dispatch, scale }: UseCanvasDragOptions) {
	const dragRef = useRef<DragState | null>(null);

	const startDrag = useCallback(
		(
			e: React.PointerEvent,
			element: EditorElement,
			handle: HandlePosition | 'move',
		) => {
			e.preventDefault();
			e.stopPropagation();
			(e.target as HTMLElement).setPointerCapture(e.pointerId);

			dragRef.current = {
				elementId: element.id,
				startX: e.clientX,
				startY: e.clientY,
				startTransform: { ...element.transform },
				handle,
			};
		},
		[],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent) => {
			const drag = dragRef.current;
			if (!drag) return;

			const dx = (e.clientX - drag.startX) / scale;
			const dy = (e.clientY - drag.startY) / scale;

			if (drag.handle === 'move') {
				dispatch({
					type: 'MOVE_ELEMENT',
					id: drag.elementId,
					x: Math.round(drag.startTransform.x + dx),
					y: Math.round(drag.startTransform.y + dy),
				});
				return;
			}

			if (drag.handle === 'rotate') {
				// Calculate rotation based on angle from center
				const centerX =
					drag.startTransform.x + drag.startTransform.width / 2;
				const centerY =
					drag.startTransform.y + drag.startTransform.height / 2;
				const currentX = centerX + dx;
				const currentY = centerY + dy;
				const angle =
					(Math.atan2(
						currentY - centerY,
						currentX - centerX,
					) *
						180) /
					Math.PI;
				const startAngle =
					(Math.atan2(
						drag.startY / scale -
							drag.startTransform.y -
							drag.startTransform.height / 2,
						drag.startX / scale -
							drag.startTransform.x -
							drag.startTransform.width / 2,
					) *
						180) /
					Math.PI;
				dispatch({
					type: 'RESIZE_ELEMENT',
					id: drag.elementId,
					transform: {
						rotation: Math.round(
							drag.startTransform.rotation + angle - startAngle,
						),
					},
				});
				return;
			}

			// Resize handles
			const t = drag.startTransform;
			let newX = t.x;
			let newY = t.y;
			let newW = t.width;
			let newH = t.height;

			if (drag.handle.includes('w')) {
				newX = t.x + dx;
				newW = t.width - dx;
			}
			if (drag.handle.includes('e')) {
				newW = t.width + dx;
			}
			if (drag.handle.includes('n')) {
				newY = t.y + dy;
				newH = t.height - dy;
			}
			if (drag.handle.includes('s')) {
				newH = t.height + dy;
			}

			// Enforce minimum size
			if (newW < 10) {
				newW = 10;
				if (drag.handle.includes('w')) newX = t.x + t.width - 10;
			}
			if (newH < 10) {
				newH = 10;
				if (drag.handle.includes('n')) newY = t.y + t.height - 10;
			}

			dispatch({
				type: 'RESIZE_ELEMENT',
				id: drag.elementId,
				transform: {
					x: Math.round(newX),
					y: Math.round(newY),
					width: Math.round(newW),
					height: Math.round(newH),
				},
			});
		},
		[dispatch, scale],
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
