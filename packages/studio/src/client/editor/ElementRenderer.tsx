import React from 'react';
import type { EditorElement } from './types.js';
import { TextRenderer } from './TextRenderer.js';
import { SolidRenderer } from './SolidRenderer.js';
import { ImageRenderer } from './ImageRenderer.js';
import { VideoRenderer } from './VideoRenderer.js';
import { AudioRenderer } from './AudioRenderer.js';

interface ElementRendererProps {
	element: EditorElement;
	fps: number;
}

export function ElementRenderer({ element, fps }: ElementRendererProps) {
	const { transform } = element;

	return (
		<div
			data-element-id={element.id}
			style={{
				position: 'absolute',
				left: transform.x,
				top: transform.y,
				width: transform.width,
				height: transform.height,
				transform: transform.rotation
					? `rotate(${transform.rotation}deg)`
					: undefined,
				opacity: transform.opacity,
				pointerEvents: 'none',
			}}
		>
			{element.type === 'text' && <TextRenderer element={element} />}
			{element.type === 'solid' && <SolidRenderer element={element} />}
			{element.type === 'image' && <ImageRenderer element={element} />}
			{element.type === 'video' && <VideoRenderer element={element} fps={fps} />}
			{element.type === 'audio' && <AudioRenderer element={element} fps={fps} />}
		</div>
	);
}
