import React from 'react';
import { useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';

const shortcuts: Array<[string, string]> = [
	['Space', 'Play / Pause'],
	['Left / Right', 'Step 1 frame'],
	['Shift + Left / Right', 'Step 10 frames'],
	['Home', 'Go to start'],
	['End', 'Go to end'],
	['L', 'Toggle loop'],
	['M', 'Toggle mute'],
	['I', 'Set in point'],
	['O', 'Set out point'],
	['X', 'Clear in/out points'],
	['Cmd/Ctrl + K', 'Quick switcher'],
	['?', 'Show this help'],
	['Escape', 'Close overlays / Deselect'],
];

const editorShortcuts: Array<[string, string]> = [
	['Cmd/Ctrl + Z', 'Undo'],
	['Cmd/Ctrl + Shift + Z', 'Redo'],
	['Delete / Backspace', 'Delete selected'],
	['Arrow keys', 'Nudge 1px'],
	['Shift + Arrow', 'Nudge 10px'],
];

export function KeyboardShortcutsHelp() {
	const dispatch = useStudioDispatch();

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: colors.overlay,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
			}}
			onClick={() =>
				dispatch({ type: 'SHOW_SHORTCUTS_HELP', show: false })
			}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					background: colors.bgPanel,
					border: `1px solid ${colors.border}`,
					borderRadius: 8,
					padding: 24,
					minWidth: 360,
					maxHeight: '80vh',
					overflowY: 'auto',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 16,
					}}
				>
					<h2
						style={{
							margin: 0,
							fontSize: 16,
							color: colors.textBright,
							fontWeight: 600,
						}}
					>
						Keyboard Shortcuts
					</h2>
					<button
						onClick={() =>
							dispatch({
								type: 'SHOW_SHORTCUTS_HELP',
								show: false,
							})
						}
						style={{
							background: 'none',
							border: 'none',
							color: colors.textDim,
							fontSize: 18,
							cursor: 'pointer',
						}}
					>
						x
					</button>
				</div>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<tbody>
						{shortcuts.map(([key, desc]) => (
							<tr key={key}>
								<td
									style={{
										padding: '6px 12px 6px 0',
										borderBottom: `1px solid ${colors.border}`,
									}}
								>
									<kbd
										style={{
											background: colors.bgInput,
											border: `1px solid ${colors.borderLight}`,
											borderRadius: 3,
											padding: '2px 6px',
											fontSize: 11,
											color: colors.textBright,
											fontFamily: 'monospace',
										}}
									>
										{key}
									</kbd>
								</td>
								<td
									style={{
										padding: '6px 0',
										borderBottom: `1px solid ${colors.border}`,
										fontSize: 13,
										color: colors.text,
									}}
								>
									{desc}
								</td>
							</tr>
						))}
						<tr>
							<td
								colSpan={2}
								style={{
									padding: '12px 0 6px',
									fontSize: 12,
									fontWeight: 600,
									color: colors.textDim,
								}}
							>
								Editor Mode
							</td>
						</tr>
						{editorShortcuts.map(([key, desc]) => (
							<tr key={key}>
								<td
									style={{
										padding: '6px 12px 6px 0',
										borderBottom: `1px solid ${colors.border}`,
									}}
								>
									<kbd
										style={{
											background: colors.bgInput,
											border: `1px solid ${colors.borderLight}`,
											borderRadius: 3,
											padding: '2px 6px',
											fontSize: 11,
											color: colors.textBright,
											fontFamily: 'monospace',
										}}
									>
										{key}
									</kbd>
								</td>
								<td
									style={{
										padding: '6px 0',
										borderBottom: `1px solid ${colors.border}`,
										fontSize: 13,
										color: colors.text,
									}}
								>
									{desc}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
