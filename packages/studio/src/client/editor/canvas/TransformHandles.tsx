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

const HANDLE_SIZE = 10; // Increased from 8 for easier grabbing
const HANDLE_HIT_AREA = 16; // Larger invisible hit area for easier clicking

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
	const hitAreaSize = HANDLE_HIT_AREA / scale;

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
			{/* Move area - larger hit area for easier dragging */}
			<div
				style={{
					position: 'absolute',
					inset: -5 / scale, // Extend hit area slightly beyond bounds
					cursor: 'move',
					touchAction: 'none', // Prevent touch scrolling while dragging
				}}
				onPointerDown={(e) =>
					onHandlePointerDown(e, element, 'move')
				}
			/>

			{/* Resize handles with larger hit areas */}
			{handlePositions.map(({ key, x, y, cursor }) => (
				<div
					key={key}
					style={{
						position: 'absolute',
						left: x * transform.width - hitAreaSize / 2,
						top: y * transform.height - hitAreaSize / 2,
						width: hitAreaSize,
						height: hitAreaSize,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor,
						touchAction: 'none',
					}}
					onPointerDown={(e) =>
						onHandlePointerDown(e, element, key)
					}
				>
					{/* Visible handle */}
					<div
						style={{
							width: handleSize,
							height: handleSize,
							background: colors.handle,
							border: `${2 / scale}px solid ${colors.handleBorder}`,
							borderRadius: 2 / scale,
							boxShadow: `0 0 ${4 / scale}px rgba(0,0,0,0.3)`,
							transition: 'transform 0.1s ease',
						}}
					/>
				</div>
			))}

			{/* Rotation handle with larger hit area */}
			<div
				style={{
					position: 'absolute',
					left: transform.width / 2 - hitAreaSize / 2,
					top: -(20 / scale) - hitAreaSize / 2,
					width: hitAreaSize,
					height: hitAreaSize,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'grab',
					touchAction: 'none',
				}}
				onPointerDown={(e) =>
					onHandlePointerDown(e, element, 'rotate')
				}
			>
				{/* Visible rotation handle */}
				<div
					style={{
						width: handleSize,
						height: handleSize,
						background: colors.handle,
						border: `${2 / scale}px solid ${colors.handleBorder}`,
						borderRadius: '50%',
						boxShadow: `0 0 ${4 / scale}px rgba(0,0,0,0.3)`,
						transition: 'transform 0.1s ease',
					}}
				/>
			</div>
			{/* Line from top-center to rotation handle */}
			<div
				style={{
					position: 'absolute',
					left: transform.width / 2 - 1 / scale,
					top: -(20 / scale),
					width: 2 / scale,
					height: 20 / scale,
					background: colors.selection,
					opacity: 0.6,
				}}
			/>
		</div>
	);
}
