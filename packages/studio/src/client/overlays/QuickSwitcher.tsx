import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';

export function QuickSwitcher() {
	const { compositions } = useStudioState();
	const dispatch = useStudioDispatch();
	const [query, setQuery] = useState('');
	const [selectedIndex, setSelectedIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const filtered = useMemo(() => {
		if (!query) return compositions;
		const q = query.toLowerCase();
		return compositions.filter((c) => c.id.toLowerCase().includes(q));
	}, [compositions, query]);

	useEffect(() => {
		setSelectedIndex(0);
	}, [query]);

	const select = (id: string) => {
		dispatch({ type: 'SELECT_COMPOSITION', id });
		dispatch({ type: 'SHOW_QUICK_SWITCHER', show: false });
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex((i) =>
					Math.min(i + 1, filtered.length - 1),
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex((i) => Math.max(i - 1, 0));
				break;
			case 'Enter':
				e.preventDefault();
				if (filtered[selectedIndex]) {
					select(filtered[selectedIndex].id);
				}
				break;
			case 'Escape':
				dispatch({ type: 'SHOW_QUICK_SWITCHER', show: false });
				break;
		}
	};

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: colors.overlay,
				display: 'flex',
				alignItems: 'flex-start',
				justifyContent: 'center',
				paddingTop: '20vh',
				zIndex: 1000,
			}}
			onClick={() =>
				dispatch({ type: 'SHOW_QUICK_SWITCHER', show: false })
			}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					background: colors.bgPanel,
					border: `1px solid ${colors.border}`,
					borderRadius: 8,
					width: 400,
					maxHeight: '50vh',
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<input
					ref={inputRef}
					type="text"
					placeholder="Search compositions..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
					style={{
						background: colors.bgInput,
						color: colors.text,
						border: 'none',
						borderBottom: `1px solid ${colors.border}`,
						padding: '12px 16px',
						fontSize: 14,
						outline: 'none',
					}}
				/>
				<div style={{ overflowY: 'auto', maxHeight: 300 }}>
					{filtered.length === 0 && (
						<div
							style={{
								padding: 16,
								color: colors.textMuted,
								fontSize: 13,
								textAlign: 'center',
							}}
						>
							No compositions found
						</div>
					)}
					{filtered.map((comp, i) => (
						<div
							key={comp.id}
							onClick={() => select(comp.id)}
							style={{
								padding: '8px 16px',
								cursor: 'pointer',
								background:
									i === selectedIndex
										? colors.bgSelected
										: 'transparent',
							}}
						>
							<div
								style={{
									fontSize: 13,
									color:
										i === selectedIndex
											? colors.textBright
											: colors.text,
									fontWeight:
										i === selectedIndex ? 600 : 400,
								}}
							>
								{comp.id}
							</div>
							<div
								style={{
									fontSize: 10,
									color: colors.textMuted,
									marginTop: 2,
								}}
							>
								{comp.width}x{comp.height} | {comp.fps}fps |{' '}
								{comp.durationInFrames}f
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
