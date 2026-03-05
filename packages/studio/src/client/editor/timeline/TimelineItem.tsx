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

	// Check if this element should show waveform
	const showWaveform =
		(element.type === 'audio' || element.type === 'video') && width > 40;

	return (
		<div
			style={{
				position: 'absolute',
				left,
				width,
				top: 2,
				bottom: 2,
				background: isSelected ? colors.selection : color,
				borderRadius: 6,
				overflow: 'hidden',
				cursor: 'pointer',
				border: isSelected
					? `2px solid ${colors.textBright}`
					: '1px solid rgba(255, 255, 255, 0.1)',
				boxSizing: 'border-box',
				display: 'flex',
				alignItems: 'center',
				boxShadow: isSelected
					? '0 4px 12px rgba(74, 158, 255, 0.3)'
					: '0 2px 6px rgba(0, 0, 0, 0.3)',
				transition: 'box-shadow 0.15s ease, border 0.15s ease',
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
					height={48}
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
					height={48}
				/>
			)}

			{/* Waveform for audio/video elements (positioned at bottom) */}
			{showWaveform && (element.type === 'audio' || element.type === 'video') && (
				<div
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						height: element.type === 'video' ? 20 : 48, // Smaller for video (has thumbnails)
						pointerEvents: 'none',
					}}
				>
					<AudioWaveform
						src={element.src}
						width={width}
						height={element.type === 'video' ? 20 : 48}
						startFrom={element.startFrom}
						durationInFrames={element.durationInFrames}
						fps={fps}
						color="rgba(255, 255, 255, 0.6)"
					/>
				</div>
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
					padding: '0 10px',
					fontSize: 12,
					fontWeight: 600,
					color: colors.textBright,
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					cursor: 'grab',
					userSelect: 'none',
					display: 'flex',
					alignItems: 'center',
					gap: 6,
					background: showThumbnails
						? 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 60%)'
						: 'rgba(0,0,0,0.3)',
					zIndex: 5,
					pointerEvents: 'none',
					textShadow: '0 1px 3px rgba(0,0,0,0.9)',
				}}
			>
				{/* Type icon */}
				<span style={{ fontSize: 14, flexShrink: 0 }}>
					{element.type === 'text' && '📝'}
					{element.type === 'solid' && '▭'}
					{element.type === 'image' && '🖼️'}
					{element.type === 'video' && '🎬'}
					{element.type === 'audio' && '🎵'}
				</span>
				<span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
					{element.name}
				</span>
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
