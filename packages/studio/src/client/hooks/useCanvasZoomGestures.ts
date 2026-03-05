import { useEffect } from 'react';
import type { StudioAction } from '../store/types.js';

interface UseCanvasZoomGesturesOptions {
	enabled: boolean; // Only active in editor mode
	containerRef: React.RefObject<HTMLDivElement>;
	dispatch: React.Dispatch<StudioAction>;
}

/**
 * Handles canvas zoom gestures:
 * - Cmd/Ctrl + scroll wheel to zoom
 * - Pinch gestures on touch devices (future)
 */
export function useCanvasZoomGestures({
	enabled,
	containerRef,
	dispatch,
}: UseCanvasZoomGesturesOptions) {
	useEffect(() => {
		if (!enabled) return;

		const container = containerRef.current;
		if (!container) return;

		const handleWheel = (e: WheelEvent) => {
			// Only zoom with Cmd/Ctrl held
			const isMeta = e.metaKey || e.ctrlKey;
			if (!isMeta) return;

			e.preventDefault();

			// Determine zoom direction
			const delta = e.deltaY;
			if (delta < 0) {
				// Scroll up = zoom in
				dispatch({ type: 'CANVAS_ZOOM_IN' });
			} else if (delta > 0) {
				// Scroll down = zoom out
				dispatch({ type: 'CANVAS_ZOOM_OUT' });
			}
		};

		// Prevent default Cmd+scroll behavior
		container.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			container.removeEventListener('wheel', handleWheel);
		};
	}, [enabled, containerRef, dispatch]);
}
