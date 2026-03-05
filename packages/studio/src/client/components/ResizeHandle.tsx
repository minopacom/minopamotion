import React, { useState } from 'react';
import { colors } from '../utils/colors.js';

interface ResizeHandleProps {
	direction: 'horizontal' | 'vertical';
	onMouseDown: (e: React.MouseEvent) => void;
}

export function ResizeHandle({ direction, onMouseDown }: ResizeHandleProps) {
	const [hovering, setHovering] = useState(false);
	const [dragging, setDragging] = useState(false);

	const handleMouseDown = (e: React.MouseEvent) => {
		setDragging(true);
		onMouseDown(e);

		const handleMouseUp = () => {
			setDragging(false);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		document.addEventListener('mouseup', handleMouseUp);
	};

	const isHorizontal = direction === 'horizontal';
	const isActive = dragging || hovering;

	return (
		<div
			onMouseDown={handleMouseDown}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			style={{
				width: isHorizontal ? 6 : undefined,
				height: isHorizontal ? undefined : 6,
				cursor: isHorizontal ? 'col-resize' : 'row-resize',
				background: isActive ? colors.accent : colors.bgLight,
				flexShrink: 0,
				transition: 'background 0.15s ease, opacity 0.15s ease',
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				opacity: isActive ? 1 : 0.6,
			}}
		>
			{/* Grip dots */}
			<div
				style={{
					display: 'flex',
					flexDirection: isHorizontal ? 'column' : 'row',
					gap: 2,
				}}
			>
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						style={{
							width: 2,
							height: 2,
							borderRadius: '50%',
							background: isActive ? colors.textBright : colors.textMuted,
							opacity: isActive ? 1 : 0.5,
							transition: 'all 0.15s ease',
						}}
					/>
				))}
			</div>

			{/* Larger hover area (hit target) */}
			<div
				style={{
					position: 'absolute',
					inset: isHorizontal ? '0 -6px' : '-6px 0',
				}}
			/>
		</div>
	);
}
