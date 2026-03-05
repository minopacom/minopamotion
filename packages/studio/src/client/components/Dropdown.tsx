import React, { useState, useRef, useEffect } from 'react';
import { colors } from '../utils/colors.js';

interface DropdownProps {
	trigger: React.ReactNode;
	children: React.ReactNode;
	align?: 'left' | 'right';
}

export function Dropdown({ trigger, children, align = 'left' }: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div ref={dropdownRef} style={{ position: 'relative' }}>
			<div onClick={() => setIsOpen(!isOpen)}>
				{trigger}
			</div>

			{isOpen && (
				<div
					style={{
						position: 'absolute',
						top: '100%',
						[align]: 0,
						marginTop: 8,
						background: colors.bgPanel,
						border: `1px solid ${colors.border}`,
						borderRadius: 8,
						boxShadow: `0 8px 24px ${colors.overlay}`,
						minWidth: 220,
						maxWidth: 320,
						zIndex: 9999,
						padding: 6,
					}}
					onClick={() => setIsOpen(false)}
				>
					{children}
				</div>
			)}
		</div>
	);
}

interface DropdownItemProps {
	icon?: string;
	label: string;
	onClick: () => void;
	description?: string;
}

export function DropdownItem({ icon, label, onClick, description }: DropdownItemProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				width: '100%',
				background: isHovered ? colors.bgHover : 'transparent',
				border: 'none',
				borderRadius: 6,
				padding: description ? '10px 12px' : '8px 12px',
				display: 'flex',
				alignItems: description ? 'flex-start' : 'center',
				gap: 10,
				cursor: 'pointer',
				transition: 'all 0.15s ease',
				textAlign: 'left',
			}}
		>
			{icon && (
				<span style={{
					fontSize: 16,
					flexShrink: 0,
					width: 20,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: description ? 2 : 0,
				}}>
					{icon}
				</span>
			)}
			<div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<div style={{
					fontSize: 13,
					fontWeight: 500,
					color: colors.text,
					lineHeight: '1.4',
				}}>
					{label}
				</div>
				{description && (
					<div style={{
						fontSize: 11,
						color: colors.textMuted,
						lineHeight: '1.3',
					}}>
						{description}
					</div>
				)}
			</div>
		</button>
	);
}

interface DropdownSeparatorProps {}

export function DropdownSeparator({}: DropdownSeparatorProps) {
	return (
		<div
			style={{
				height: 1,
				background: colors.border,
				margin: '4px 8px',
			}}
		/>
	);
}
