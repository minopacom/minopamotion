import React from 'react';
import type { PlayerRef } from '@minopamotion/player';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';

const RATE_OPTIONS = [0.25, 0.5, 1, 1.5, 2];

interface RateSelectorProps {
	playerRef: React.RefObject<PlayerRef | null>;
}

export function RateSelector({ playerRef }: RateSelectorProps) {
	const { playbackRate } = useStudioState();
	const dispatch = useStudioDispatch();

	return (
		<select
			value={playbackRate}
			onChange={(e) => {
				const rate = Number(e.target.value);
				dispatch({ type: 'SET_PLAYBACK_RATE', rate });
				playerRef.current?.setPlaybackRate(rate);
			}}
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
			title="Playback rate"
		>
			{RATE_OPTIONS.map((rate) => (
				<option key={rate} value={rate}>
					{rate}x
				</option>
			))}
		</select>
	);
}
