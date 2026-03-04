import React, { useState, useMemo } from 'react';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';

export function CompositionList() {
	const { compositions, selectedCompositionId } = useStudioState();
	const dispatch = useStudioDispatch();
	const [search, setSearch] = useState('');

	const filtered = useMemo(() => {
		if (!search) return compositions;
		const q = search.toLowerCase();
		return compositions.filter((c) => c.id.toLowerCase().includes(q));
	}, [compositions, search]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				background: colors.bgPanel,
				borderRight: `1px solid ${colors.border}`,
			}}
		>
			<div
				style={{
					padding: '8px',
					borderBottom: `1px solid ${colors.border}`,
				}}
			>
				<div
					style={{
						fontSize: 11,
						fontWeight: 600,
						color: colors.textDim,
						textTransform: 'uppercase',
						letterSpacing: 1,
						marginBottom: 6,
					}}
				>
					Compositions
				</div>
				<input
					type="text"
					placeholder="Search..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{
						width: '100%',
						boxSizing: 'border-box',
						background: colors.bgInput,
						color: colors.text,
						border: `1px solid ${colors.border}`,
						borderRadius: 4,
						padding: '4px 8px',
						fontSize: 12,
						outline: 'none',
					}}
				/>
			</div>

			<div style={{ flex: 1, overflowY: 'auto' }}>
				{filtered.length === 0 && (
					<div
						style={{
							padding: 12,
							color: colors.textMuted,
							fontSize: 12,
						}}
					>
						No compositions found
					</div>
				)}
				{filtered.map((comp) => {
					const selected = comp.id === selectedCompositionId;
					return (
						<div
							key={comp.id}
							onClick={() =>
								dispatch({
									type: 'SELECT_COMPOSITION',
									id: comp.id,
								})
							}
							style={{
								padding: '8px 12px',
								cursor: 'pointer',
								background: selected
									? colors.bgSelected
									: 'transparent',
								borderLeft: selected
									? `3px solid ${colors.accentLight}`
									: '3px solid transparent',
							}}
						>
							<div
								style={{
									fontSize: 13,
									color: selected
										? colors.textBright
										: colors.text,
									fontWeight: selected ? 600 : 400,
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
					);
				})}
			</div>
		</div>
	);
}
