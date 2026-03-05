import React, { useState } from 'react';
import type { TimelineTransitionEffect } from '../types.js';
import { colors } from '../../utils/colors.js';

interface TransitionOption {
	effect: TimelineTransitionEffect;
	label: string;
	icon: string;
	description: string;
}

const transitionOptions: TransitionOption[] = [
	{ effect: 'crossfade', label: 'Crossfade', icon: '⨯', description: 'Standard blend' },
	{ effect: 'dissolve', label: 'Dissolve', icon: '◐', description: 'Gradual fade' },
	{ effect: 'wipe-left', label: 'Wipe Left', icon: '←', description: 'Wipe from left' },
	{ effect: 'wipe-right', label: 'Wipe Right', icon: '→', description: 'Wipe from right' },
	{ effect: 'wipe-up', label: 'Wipe Up', icon: '↑', description: 'Wipe upward' },
	{ effect: 'wipe-down', label: 'Wipe Down', icon: '↓', description: 'Wipe downward' },
	{ effect: 'slide-left', label: 'Slide Left', icon: '⇐', description: 'Slide from left' },
	{ effect: 'slide-right', label: 'Slide Right', icon: '⇒', description: 'Slide from right' },
	{ effect: 'zoom-in', label: 'Zoom In', icon: '⊕', description: 'Zoom into next' },
	{ effect: 'zoom-out', label: 'Zoom Out', icon: '⊖', description: 'Zoom out' },
];

export function TransitionsPanel() {
	const [isDragging, setIsDragging] = useState(false);
	const [draggedEffect, setDraggedEffect] = useState<TimelineTransitionEffect | null>(null);

	const handleDragStart = (e: React.DragEvent, effect: TimelineTransitionEffect) => {
		setIsDragging(true);
		setDraggedEffect(effect);

		// Store the transition effect in the dataTransfer
		e.dataTransfer.setData('application/transition', effect);
		e.dataTransfer.effectAllowed = 'copy';

		// Create a custom drag image
		const dragImage = document.createElement('div');
		dragImage.style.padding = '8px 12px';
		dragImage.style.background = colors.accent;
		dragImage.style.color = colors.textBright;
		dragImage.style.borderRadius = '6px';
		dragImage.style.fontSize = '12px';
		dragImage.style.fontWeight = '600';
		dragImage.style.position = 'absolute';
		dragImage.style.top = '-1000px';
		dragImage.textContent = transitionOptions.find(t => t.effect === effect)?.label || effect;
		document.body.appendChild(dragImage);
		e.dataTransfer.setDragImage(dragImage, 0, 0);
		setTimeout(() => document.body.removeChild(dragImage), 0);
	};

	const handleDragEnd = () => {
		setIsDragging(false);
		setDraggedEffect(null);
	};

	return (
		<div
			style={{
				width: 200,
				background: colors.bgPanel,
				borderRight: `1px solid ${colors.border}`,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'auto',
			}}
		>
			{/* Header */}
			<div
				style={{
					padding: 12,
					borderBottom: `1px solid ${colors.border}`,
					fontSize: 13,
					fontWeight: 600,
					color: colors.textBright,
					display: 'flex',
					alignItems: 'center',
					gap: 6,
				}}
			>
				<span>✨</span>
				<span>Transitions</span>
			</div>

			{/* Instructions */}
			<div
				style={{
					padding: 12,
					fontSize: 11,
					color: colors.textMuted,
					borderBottom: `1px solid ${colors.border}`,
					lineHeight: 1.5,
				}}
			>
				Drag and drop transitions onto the timeline to blend clips together.
			</div>

			{/* Transition options */}
			<div
				style={{
					flex: 1,
					padding: 8,
					display: 'flex',
					flexDirection: 'column',
					gap: 6,
				}}
			>
				{transitionOptions.map((option) => (
					<div
						key={option.effect}
						draggable
						onDragStart={(e) => handleDragStart(e, option.effect)}
						onDragEnd={handleDragEnd}
						style={{
							padding: 10,
							background: draggedEffect === option.effect
								? colors.bgSelected
								: colors.bgSecondary,
							border: `1px solid ${colors.border}`,
							borderRadius: 6,
							cursor: 'grab',
							display: 'flex',
							flexDirection: 'column',
							gap: 4,
							transition: 'all 0.15s ease',
							opacity: isDragging && draggedEffect !== option.effect ? 0.5 : 1,
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = colors.bgSelected;
							e.currentTarget.style.borderColor = colors.accent;
						}}
						onMouseLeave={(e) => {
							if (draggedEffect !== option.effect) {
								e.currentTarget.style.background = colors.bgSecondary;
								e.currentTarget.style.borderColor = colors.border;
							}
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 8,
							}}
						>
							<span
								style={{
									fontSize: 18,
									width: 24,
									textAlign: 'center',
								}}
							>
								{option.icon}
							</span>
							<div style={{ flex: 1 }}>
								<div
									style={{
										fontSize: 12,
										fontWeight: 600,
										color: colors.textBright,
									}}
								>
									{option.label}
								</div>
								<div
									style={{
										fontSize: 10,
										color: colors.textMuted,
									}}
								>
									{option.description}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
