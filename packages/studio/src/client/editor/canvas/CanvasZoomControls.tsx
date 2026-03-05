import React from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { colors } from '../../utils/colors.js';

export function CanvasZoomControls() {
	const { canvasZoom, canvasZoomFitToScreen } = useStudioState();
	const dispatch = useStudioDispatch();

	const zoomPercentage = Math.round(canvasZoom * 100);

	return (
		<div
			style={{
				position: 'absolute',
				top: 8,
				right: 8,
				display: 'flex',
				gap: 4,
				background: colors.bgPanel,
				border: `1px solid ${colors.border}`,
				borderRadius: 4,
				padding: 4,
				zIndex: 100,
			}}
		>
			{/* Zoom out button */}
			<button
				onClick={() => dispatch({ type: 'CANVAS_ZOOM_OUT' })}
				disabled={canvasZoom <= 0.1}
				style={{
					background: colors.bgInput,
					color: colors.text,
					border: `1px solid ${colors.border}`,
					borderRadius: 3,
					padding: '4px 8px',
					fontSize: 11,
					cursor: canvasZoom <= 0.1 ? 'not-allowed' : 'pointer',
					opacity: canvasZoom <= 0.1 ? 0.5 : 1,
				}}
				title="Zoom out (- key)"
			>
				−
			</button>

			{/* Zoom percentage display (clickable to reset) */}
			<button
				onClick={() => dispatch({ type: 'CANVAS_ZOOM_RESET' })}
				style={{
					background: canvasZoomFitToScreen
						? colors.accent
						: colors.bgInput,
					color: canvasZoomFitToScreen ? colors.textBright : colors.text,
					border: `1px solid ${colors.border}`,
					borderRadius: 3,
					padding: '4px 12px',
					fontSize: 11,
					cursor: 'pointer',
					fontWeight: 600,
					minWidth: 60,
				}}
				title="Click to reset zoom (0 key)"
			>
				{canvasZoomFitToScreen ? 'Fit' : `${zoomPercentage}%`}
			</button>

			{/* Zoom in button */}
			<button
				onClick={() => dispatch({ type: 'CANVAS_ZOOM_IN' })}
				disabled={canvasZoom >= 5}
				style={{
					background: colors.bgInput,
					color: colors.text,
					border: `1px solid ${colors.border}`,
					borderRadius: 3,
					padding: '4px 8px',
					fontSize: 11,
					cursor: canvasZoom >= 5 ? 'not-allowed' : 'pointer',
					opacity: canvasZoom >= 5 ? 0.5 : 1,
				}}
				title="Zoom in (+ key)"
			>
				+
			</button>

			{/* Fit to screen button */}
			<button
				onClick={() => dispatch({ type: 'CANVAS_ZOOM_FIT' })}
				style={{
					background: colors.bgInput,
					color: colors.text,
					border: `1px solid ${colors.border}`,
					borderRadius: 3,
					padding: '4px 8px',
					fontSize: 11,
					cursor: 'pointer',
				}}
				title="Fit to screen"
			>
				⊡
			</button>
		</div>
	);
}
