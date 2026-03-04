import React from 'react';
import type { TComposition } from '@minopamotion/core';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { SelectionBox } from './SelectionBox.js';
import { TransformHandles } from './TransformHandles.js';
import { useCanvasSelection } from './useCanvasSelection.js';
import { useCanvasDrag } from './useCanvasDrag.js';

interface CanvasOverlayProps {
	composition: TComposition;
	scale: number;
	offsetX: number;
	offsetY: number;
}

export function CanvasOverlay({
	composition,
	scale,
	offsetX,
	offsetY,
}: CanvasOverlayProps) {
	const { editorScene, selectedElementIds } = useStudioState();
	const dispatch = useStudioDispatch();
	const { elements, tracks } = editorScene;

	const trackOrder = new Map<string, number>();
	tracks.forEach((t, i) => trackOrder.set(t.id, i));

	const visibleTrackIds = new Set(
		tracks.filter((t) => t.visible).map((t) => t.id),
	);
	const visibleElements = elements.filter((el) =>
		visibleTrackIds.has(el.trackId),
	);

	const selectedElements = visibleElements.filter((el) =>
		selectedElementIds.includes(el.id),
	);

	const { handleClick } = useCanvasSelection({
		elements: visibleElements,
		trackOrder,
		dispatch,
		scale,
		offsetX,
		offsetY,
	});

	const { startDrag, onPointerMove, onPointerUp } = useCanvasDrag({
		dispatch,
		scale,
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: offsetX,
				top: offsetY,
				width: composition.width * scale,
				height: composition.height * scale,
				pointerEvents: 'auto',
			}}
			onClick={handleClick}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
		>
			{/* Scaled inner container to match composition coordinates */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: composition.width,
					height: composition.height,
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
				}}
			>
				{selectedElements.map((el) => (
					<React.Fragment key={el.id}>
						<SelectionBox transform={el.transform} />
						<TransformHandles
							element={el}
							scale={scale}
							onHandlePointerDown={startDrag}
						/>
					</React.Fragment>
				))}
			</div>
		</div>
	);
}
