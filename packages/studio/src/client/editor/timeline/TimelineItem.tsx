import React from 'react';
import type { EditorElement } from '../types.js';
import { colors } from '../../utils/colors.js';
import { ThumbnailStrip } from './ThumbnailStrip.js';
import { AudioWaveform } from './AudioWaveform.js';

interface TimelineItemProps {
	element: EditorElement;
	pxPerFrame: number;
	isSelected: boolean;
	trackColorIndex: number;
	fps: number;
	onPointerDownMove: (e: React.PointerEvent) => void;
	onPointerDownTrimStart: (e: React.PointerEvent) => void;
	onPointerDownTrimEnd: (e: React.PointerEvent) => void;
	onClick: (e: React.MouseEvent) => void;
}

const TRIM_HANDLE_WIDTH = 6;

export function TimelineItem({
	element,
	pxPerFrame,
	isSelected,
	trackColorIndex,
	fps,
	onPointerDownMove,
	onPointerDownTrimStart,
	onPointerDownTrimEnd,
	onClick,
}: TimelineItemProps) {
	const left = element.from * pxPerFrame;
	const width = element.durationInFrames * pxPerFrame;
	const color =
		colors.trackColors[trackColorIndex % colors.trackColors.length];

	// Check if this element should show thumbnails
	const showThumbnails =
		(element.type === 'video' || element.type === 'image') && width > 40;

	return (
		<div
			style={{
				position: 'absolute',
				left,
				width,
				top: 2,
				bottom: 2,
				background: isSelected ? colors.selection : color,
				borderRadius: 3,
				overflow: 'hidden',
				cursor: 'pointer',
				border: isSelected
					? `1px solid ${colors.textBright}`
					: '1px solid transparent',
				boxSizing: 'border-box',
				display: 'flex',
				alignItems: 'center',
			}}
			onClick={onClick}
		>
			{/* Thumbnail strip for video/image elements */}
			{showThumbnails && element.type === 'video' && (
				<ThumbnailStrip
					src={element.src}
					type="video"
					durationInFrames={element.durationInFrames}
					startFrom={element.startFrom}
					fps={fps}
					width={width}
					height={26}
				/>
			)}
			{showThumbnails && element.type === 'image' && (
				<ThumbnailStrip
					src={element.src}
					type="image"
					durationInFrames={element.durationInFrames}
					startFrom={0}
					fps={fps}
					width={width}
					height={26}
				/>
			)}

			{/* Trim start handle */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					bottom: 0,
					width: TRIM_HANDLE_WIDTH,
					cursor: 'ew-resize',
					zIndex: 10,
				}}
				onPointerDown={onPointerDownTrimStart}
			/>

			{/* Main drag area with element name overlay */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					padding: '0 8px',
					fontSize: 10,
					color: colors.textBright,
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					cursor: 'grab',
					userSelect: 'none',
					display: 'flex',
					alignItems: 'center',
					background: showThumbnails
						? 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)'
						: 'transparent',
					zIndex: 5,
					pointerEvents: 'none',
				}}
			>
				{element.name}
			</div>

			{/* Invisible drag target (sits above thumbnails) */}
			<div
				style={{
					position: 'absolute',
					left: TRIM_HANDLE_WIDTH,
					right: TRIM_HANDLE_WIDTH,
					top: 0,
					bottom: 0,
					cursor: 'grab',
					zIndex: 8,
				}}
				onPointerDown={onPointerDownMove}
			/>

			{/* Trim end handle */}
			<div
				style={{
					position: 'absolute',
					right: 0,
					top: 0,
					bottom: 0,
					width: TRIM_HANDLE_WIDTH,
					cursor: 'ew-resize',
					zIndex: 10,
				}}
				onPointerDown={onPointerDownTrimEnd}
			/>
		</div>
	);
}
