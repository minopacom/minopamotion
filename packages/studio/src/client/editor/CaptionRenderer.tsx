import React, { useMemo } from 'react';
import { useCurrentFrame } from '@minopamotion/core';
import type { CaptionElement } from './types.js';

interface CaptionRendererProps {
	element: CaptionElement;
}

export function CaptionRenderer({ element }: CaptionRendererProps) {
	const frame = useCurrentFrame();
	const localFrame = frame - element.from;

	// Calculate Y position based on position preset
	const getYPosition = () => {
		const { height } = element.transform;
		const padding = 40;

		switch (element.position) {
			case 'top':
				return padding;
			case 'bottom':
				return 1080 - height - padding;
			case 'center':
			default:
				return (1080 - height) / 2;
		}
	};

	// Find current word if word-by-word highlighting is enabled
	const currentWord = useMemo(() => {
		if (!element.words || element.words.length === 0) return null;

		for (const word of element.words) {
			const wordEnd = word.start + word.duration;
			if (localFrame >= word.start && localFrame < wordEnd) {
				return word;
			}
		}
		return null;
	}, [element.words, localFrame]);

	// Split text into words for highlighting
	const renderText = () => {
		if (!element.words || element.words.length === 0) {
			return element.text;
		}

		const words = element.text.split(/(\s+)/);
		return words.map((word, index) => {
			const wordData = element.words?.find(w => w.text.trim() === word.trim());
			const isCurrentWord = wordData && currentWord && wordData.text === currentWord.text;

			if (word.trim() === '') {
				return <span key={index}>{word}</span>;
			}

			return (
				<span
					key={index}
					style={{
						color: isCurrentWord
							? element.highlightColor || '#facc15'
							: element.color,
						transition: 'color 0.1s ease',
						fontWeight: isCurrentWord ? 700 : element.fontWeight,
					}}
				>
					{word}
				</span>
			);
		});
	};

	return (
		<div
			style={{
				position: 'absolute',
				left: element.transform.x,
				top: getYPosition(),
				width: element.transform.width,
				height: element.transform.height,
				transform: element.transform.rotation ? `rotate(${element.transform.rotation}deg)` : undefined,
				opacity: element.transform.opacity,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundColor: element.backgroundColor,
					opacity: element.backgroundOpacity,
					borderRadius: element.borderRadius,
				}}
			/>
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: element.textAlign === 'left'
						? 'flex-start'
						: element.textAlign === 'right'
							? 'flex-end'
							: 'center',
					padding: element.padding,
					fontSize: element.fontSize,
					fontFamily: element.fontFamily,
					fontWeight: element.fontWeight,
					color: element.color,
					textAlign: element.textAlign,
					lineHeight: element.lineHeight,
					wordWrap: 'break-word',
					overflowWrap: 'break-word',
				}}
			>
				{renderText()}
			</div>
		</div>
	);
}
