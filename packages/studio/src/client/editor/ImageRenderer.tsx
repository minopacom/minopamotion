import React from 'react';
import type { ImageElement } from './types.js';

interface ImageRendererProps {
	element: ImageElement;
}

export function ImageRenderer({ element }: ImageRendererProps) {
	return (
		<img
			src={element.src}
			alt={element.name}
			style={{
				width: '100%',
				height: '100%',
				objectFit: element.objectFit,
				userSelect: 'none',
				pointerEvents: 'none',
			}}
		/>
	);
}
