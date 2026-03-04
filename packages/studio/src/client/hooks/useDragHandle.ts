import { useCallback, useRef } from 'react';

type Direction = 'horizontal' | 'vertical';

interface UseDragHandleOptions {
	direction: Direction;
	onDrag: (delta: number) => void;
	onDragEnd?: () => void;
}

export function useDragHandle({ direction, onDrag, onDragEnd }: UseDragHandleOptions) {
	const startPos = useRef(0);
	const dragging = useRef(false);

	const onMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			dragging.current = true;
			startPos.current =
				direction === 'horizontal' ? e.clientX : e.clientY;

			const onMouseMove = (ev: MouseEvent) => {
				if (!dragging.current) return;
				const current =
					direction === 'horizontal' ? ev.clientX : ev.clientY;
				const delta = current - startPos.current;
				startPos.current = current;
				onDrag(delta);
			};

			const onMouseUp = () => {
				dragging.current = false;
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
				onDragEnd?.();
			};

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		},
		[direction, onDrag, onDragEnd],
	);

	return { onMouseDown };
}
