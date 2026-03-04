import React from 'react';
import type { EditorElement } from '../types.js';
import type { HandlePosition } from './useCanvasDrag.js';
import { colors } from '../../utils/colors.js';

interface TransformHandlesProps {
	element: EditorElement;
	scale: number;
	onHandlePointerDown: (
		e: React.PointerEvent,
		element: EditorElement,
		handle: HandlePosition | 'move',
	) => void;
}

const HANDLE_SIZE = 8;

const handlePositions: Array<{
	key: HandlePosition;
	x: number;
	y: number;
	cursor: string;
}> = [
	{ key: 'nw', x: 0, y: 0, cursor: 'nwse-resize' },
	{ key: 'n', x: 0.5, y: 0, cursor: 'ns-resize' },
	{ key: 'ne', x: 1, y: 0, cursor: 'nesw-resize' },
	{ key: 'e', x: 1, y: 0.5, cursor: 'ew-resize' },
	{ key: 'se', x: 1, y: 1, cursor: 'nwse-resize' },
	{ key: 's', x: 0.5, y: 1, cursor: 'ns-resize' },
	{ key: 'sw', x: 0, y: 1, cursor: 'nesw-resize' },
	{ key: 'w', x: 0, y: 0.5, cursor: 'ew-resize' },
];

export function TransformHandles({
	element,
	scale,
	onHandlePointerDown,
}: TransformHandlesProps) {
	const { transform } = element;
	const handleSize = HANDLE_SIZE / scale;

	return (
		<div
			style={{
				position: 'absolute',
				left: transform.x,
				top: transform.y,
				width: transform.width,
				height: transform.height,
				transform: transform.rotation
					? `rotate(${transform.rotation}deg)`
					: undefined,
				transformOrigin: 'center center',
			}}
		>
			{/* Move area */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					cursor: 'move',
				}}
				onPointerDown={(e) =>
					onHandlePointerDown(e, element, 'move')
				}
			/>

			{/* Resize handles */}
			{handlePositions.map(({ key, x, y, cursor }) => (
				<div
					key={key}
					style={{
						position: 'absolute',
						left: x * transform.width - handleSize / 2,
						top: y * transform.height - handleSize / 2,
						width: handleSize,
						height: handleSize,
						background: colors.handle,
						border: `${1 / scale}px solid ${colors.handleBorder}`,
						cursor,
						borderRadius: 1 / scale,
					}}
					onPointerDown={(e) =>
						onHandlePointerDown(e, element, key)
					}
				/>
			))}

			{/* Rotation handle */}
			<div
				style={{
					position: 'absolute',
					left: transform.width / 2 - handleSize / 2,
					top: -(20 / scale) - handleSize / 2,
					width: handleSize,
					height: handleSize,
					background: colors.handle,
					border: `${1 / scale}px solid ${colors.handleBorder}`,
					borderRadius: '50%',
					cursor: 'grab',
				}}
				onPointerDown={(e) =>
					onHandlePointerDown(e, element, 'rotate')
				}
			/>
			{/* Line from top-center to rotation handle */}
			<div
				style={{
					position: 'absolute',
					left: transform.width / 2 - 0.5 / scale,
					top: -(20 / scale),
					width: 1 / scale,
					height: 20 / scale,
					background: colors.selection,
				}}
			/>
		</div>
	);
}
