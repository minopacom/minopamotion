import React from 'react';
import type { PlayerRef } from '@minopamotion/player';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';

interface PlaybackControlsProps {
	playerRef: React.RefObject<PlayerRef | null>;
}

const btnStyle: React.CSSProperties = {
	background: 'none',
	border: 'none',
	color: colors.text,
	cursor: 'pointer',
	fontSize: 16,
	padding: '4px 8px',
	borderRadius: 4,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minWidth: 32,
};

const activeBtnStyle: React.CSSProperties = {
	...btnStyle,
	color: colors.accentLight,
};

export function PlaybackControls({ playerRef }: PlaybackControlsProps) {
	const { playing, loop, muted } = useStudioState();
	const dispatch = useStudioDispatch();

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
			<button
				style={btnStyle}
				onClick={() => {
					dispatch({ type: 'GO_TO_START' });
					playerRef.current?.seekTo(0);
				}}
				title="Go to start (Home)"
			>
				{'|<'}
			</button>
			<button
				style={btnStyle}
				onClick={() => {
					dispatch({ type: 'STEP_FRAME', delta: -1 });
					playerRef.current?.seekTo(
						(playerRef.current?.getCurrentFrame() ?? 0) - 1,
					);
				}}
				title="Step back (Left)"
			>
				{'<'}
			</button>
			<button
				style={{
					...btnStyle,
					fontSize: 18,
					fontWeight: 'bold',
					minWidth: 40,
				}}
				onClick={() => {
					if (playing) {
						playerRef.current?.pause();
					} else {
						playerRef.current?.play();
					}
				}}
				title="Play/Pause (Space)"
			>
				{playing ? '||' : '\u25B6'}
			</button>
			<button
				style={btnStyle}
				onClick={() => {
					dispatch({ type: 'STEP_FRAME', delta: 1 });
					playerRef.current?.seekTo(
						(playerRef.current?.getCurrentFrame() ?? 0) + 1,
					);
				}}
				title="Step forward (Right)"
			>
				{'>'}
			</button>
			<button
				style={btnStyle}
				onClick={() => {
					dispatch({ type: 'GO_TO_END' });
				}}
				title="Go to end (End)"
			>
				{'>|'}
			</button>

			<div
				style={{
					width: 1,
					height: 20,
					background: colors.border,
					margin: '0 4px',
				}}
			/>

			<button
				style={loop ? activeBtnStyle : btnStyle}
				onClick={() => dispatch({ type: 'TOGGLE_LOOP' })}
				title="Toggle loop (L)"
			>
				Loop
			</button>
			<button
				style={muted ? activeBtnStyle : btnStyle}
				onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
				title="Toggle mute (M)"
			>
				{muted ? 'Unmute' : 'Mute'}
			</button>
		</div>
	);
}
