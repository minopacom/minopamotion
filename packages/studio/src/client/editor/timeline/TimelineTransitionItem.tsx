import React, { useState } from 'react';
import type { TimelineTransitionItem } from '../types.js';
import { colors } from '../../utils/colors.js';

interface TimelineTransitionItemProps {
	transition: TimelineTransitionItem;
	pxPerFrame: number;
	isSelected: boolean;
	onClick: (e: React.MouseEvent) => void;
	onPointerDownResize: (e: React.PointerEvent, edge: 'left' | 'right') => void;
	onPointerDownMove: (e: React.PointerEvent) => void;
}

const TRANSITION_HEIGHT = 56;
const HANDLE_WIDTH = 8;

export function TimelineTransitionItem({
	transition,
	pxPerFrame,
	isSelected,
	onClick,
	onPointerDownResize,
	onPointerDownMove,
}: TimelineTransitionItemProps) {
	const [hovered, setHovered] = useState(false);

	const left = transition.from * pxPerFrame;
	const width = transition.durationInFrames * pxPerFrame;

	// Get transition icon/label
	const getTransitionLabel = () => {
		switch (transition.effect) {
			case 'crossfade':
				return '⨯ Crossfade';
			case 'dissolve':
				return '◐ Dissolve';
			case 'wipe-left':
				return '← Wipe';
			case 'wipe-right':
				return '→ Wipe';
			case 'wipe-up':
				return '↑ Wipe';
			case 'wipe-down':
				return '↓ Wipe';
			case 'slide-left':
				return '⇐ Slide';
			case 'slide-right':
				return '⇒ Slide';
			case 'zoom-in':
				return '⊕ Zoom In';
			case 'zoom-out':
				return '⊖ Zoom Out';
			default:
				return transition.effect;
		}
	};

	return (
		<div
			style={{
				position: 'absolute',
				left,
				width: Math.max(width, 20), // Minimum 20px width
				top: 2,
				height: TRANSITION_HEIGHT - 4,
				background: isSelected
					? `linear-gradient(135deg, ${colors.accent}AA 0%, ${colors.accent}DD 100%)`
					: `linear-gradient(135deg, #7c3aed88 0%, #a855f7AA 100%)`,
				border: isSelected
					? `2px solid ${colors.accent}`
					: '1px solid rgba(168, 85, 247, 0.5)',
				borderRadius: 4,
				cursor: 'move',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 10,
				fontWeight: 600,
				color: colors.textBright,
				boxShadow: isSelected
					? '0 4px 12px rgba(124, 58, 237, 0.5)'
					: '0 2px 6px rgba(124, 58, 237, 0.3)',
				transition: 'all 0.15s ease',
				pointerEvents: 'auto',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				padding: '0 4px',
			}}
			onClick={onClick}
			onPointerDown={(e) => {
				// Don't trigger move if clicking on handles
				const rect = e.currentTarget.getBoundingClientRect();
				const x = e.clientX - rect.left;
				if (x > HANDLE_WIDTH && x < width - HANDLE_WIDTH) {
					onPointerDownMove(e);
				}
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* Left resize handle */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					bottom: 0,
					width: HANDLE_WIDTH,
					cursor: 'ew-resize',
					background: hovered || isSelected ? 'rgba(255,255,255,0.2)' : 'transparent',
					borderRight: hovered || isSelected ? '1px solid rgba(255,255,255,0.3)' : 'none',
				}}
				onPointerDown={(e) => {
					e.stopPropagation();
					onPointerDownResize(e, 'left');
				}}
			/>

			{/* Transition label */}
			<div
				style={{
					flex: 1,
					textAlign: 'center',
					pointerEvents: 'none',
					textShadow: '0 1px 2px rgba(0,0,0,0.5)',
				}}
			>
				{width > 60 ? getTransitionLabel() : '⨯'}
			</div>

			{/* Right resize handle */}
			<div
				style={{
					position: 'absolute',
					right: 0,
					top: 0,
					bottom: 0,
					width: HANDLE_WIDTH,
					cursor: 'ew-resize',
					background: hovered || isSelected ? 'rgba(255,255,255,0.2)' : 'transparent',
					borderLeft: hovered || isSelected ? '1px solid rgba(255,255,255,0.3)' : 'none',
				}}
				onPointerDown={(e) => {
					e.stopPropagation();
					onPointerDownResize(e, 'right');
				}}
			/>

			{/* Diagonal stripes pattern */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
					pointerEvents: 'none',
				}}
			/>
		</div>
	);
}
