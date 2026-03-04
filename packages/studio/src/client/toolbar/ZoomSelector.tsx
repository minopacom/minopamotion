import React from 'react';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';

const ZOOM_OPTIONS = [
	{ label: 'Fit', value: 0 },
	{ label: '25%', value: 25 },
	{ label: '50%', value: 50 },
	{ label: '75%', value: 75 },
	{ label: '100%', value: 100 },
	{ label: '150%', value: 150 },
	{ label: '200%', value: 200 },
];

export function ZoomSelector() {
	const { previewZoom } = useStudioState();
	const dispatch = useStudioDispatch();

	return (
		<select
			value={previewZoom}
			onChange={(e) =>
				dispatch({
					type: 'SET_PREVIEW_ZOOM',
					zoom: Number(e.target.value),
				})
			}
			style={{
				background: colors.bgInput,
				color: colors.text,
				border: `1px solid ${colors.border}`,
				borderRadius: 4,
				padding: '4px 8px',
				fontSize: 12,
				cursor: 'pointer',
				outline: 'none',
			}}
			title="Preview zoom"
		>
			{ZOOM_OPTIONS.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
	);
}
