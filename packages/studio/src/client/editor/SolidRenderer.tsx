import React from 'react';
import type { SolidElement } from './types.js';

interface SolidRendererProps {
	element: SolidElement;
}

export function SolidRenderer({ element }: SolidRendererProps) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: element.color,
				borderRadius: element.borderRadius,
			}}
		/>
	);
}
