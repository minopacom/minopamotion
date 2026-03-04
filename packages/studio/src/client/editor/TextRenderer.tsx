import React from 'react';
import type { TextElement } from './types.js';

interface TextRendererProps {
	element: TextElement;
}

export function TextRenderer({ element }: TextRendererProps) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: element.textAlign === 'center' ? 'center' : 'flex-start',
				justifyContent:
					element.textAlign === 'left'
						? 'flex-start'
						: element.textAlign === 'right'
							? 'flex-end'
							: 'center',
				fontSize: element.fontSize,
				fontFamily: element.fontFamily,
				fontWeight: element.fontWeight,
				color: element.color,
				lineHeight: element.lineHeight,
				textAlign: element.textAlign,
				whiteSpace: 'pre-wrap',
				wordBreak: 'break-word',
				overflow: 'hidden',
				userSelect: 'none',
			}}
		>
			{element.text}
		</div>
	);
}
