import React from 'react';
import type { Transform } from '../types.js';
import { colors } from '../../utils/colors.js';

interface SelectionBoxProps {
	transform: Transform;
}

export function SelectionBox({ transform }: SelectionBoxProps) {
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
				border: `2px solid ${colors.selection}`,
				pointerEvents: 'none',
				boxSizing: 'border-box',
			}}
		/>
	);
}
