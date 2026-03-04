import React, { useState, useEffect } from 'react';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { PropField } from './PropEditors.js';
import { ElementInspector } from '../editor/inspector/ElementInspector.js';
import { colors } from '../utils/colors.js';

export function PropsPanel() {
	const { inputProps, propsMode, compositions, selectedCompositionId, editorMode } =
		useStudioState();
	const dispatch = useStudioDispatch();
	const [jsonText, setJsonText] = useState('');
	const [jsonError, setJsonError] = useState<string | null>(null);

	const comp = compositions.find((c) => c.id === selectedCompositionId);
	const defaultProps = comp?.defaultProps ?? {};

	useEffect(() => {
		setJsonText(JSON.stringify(inputProps, null, 2));
		setJsonError(null);
	}, [inputProps]);

	const handleJsonChange = (text: string) => {
		setJsonText(text);
		try {
			const parsed = JSON.parse(text);
			setJsonError(null);
			dispatch({ type: 'SET_INPUT_PROPS', props: parsed });
		} catch {
			setJsonError('Invalid JSON');
		}
	};

	const propKeys = Object.keys(inputProps);

	if (editorMode) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					background: colors.bgPanel,
					borderLeft: `1px solid ${colors.border}`,
				}}
			>
				<div
					style={{
						padding: 8,
						borderBottom: `1px solid ${colors.border}`,
					}}
				>
					<span
						style={{
							fontSize: 11,
							fontWeight: 600,
							color: colors.textDim,
							textTransform: 'uppercase',
							letterSpacing: 1,
						}}
					>
						Inspector
					</span>
				</div>
				<div style={{ flex: 1, overflowY: 'auto' }}>
					<ElementInspector />
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				background: colors.bgPanel,
				borderLeft: `1px solid ${colors.border}`,
			}}
		>
			<div
				style={{
					padding: 8,
					borderBottom: `1px solid ${colors.border}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<span
					style={{
						fontSize: 11,
						fontWeight: 600,
						color: colors.textDim,
						textTransform: 'uppercase',
						letterSpacing: 1,
					}}
				>
					Props
				</span>
				<div style={{ display: 'flex', gap: 0 }}>
					{(['smart', 'json'] as const).map((mode) => (
						<button
							key={mode}
							onClick={() =>
								dispatch({ type: 'SET_PROPS_MODE', mode })
							}
							style={{
								background:
									propsMode === mode
										? colors.bgSelected
										: colors.bgInput,
								color:
									propsMode === mode
										? colors.textBright
										: colors.textDim,
								border: `1px solid ${colors.border}`,
								padding: '2px 8px',
								fontSize: 10,
								cursor: 'pointer',
								textTransform: 'uppercase',
								borderRadius:
									mode === 'smart'
										? '4px 0 0 4px'
										: '0 4px 4px 0',
							}}
						>
							{mode}
						</button>
					))}
				</div>
			</div>

			<div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
				{propsMode === 'smart' ? (
					propKeys.length === 0 ? (
						<div
							style={{
								color: colors.textMuted,
								fontSize: 12,
								padding: 8,
							}}
						>
							No props defined
						</div>
					) : (
						propKeys.map((key) => (
							<PropField
								key={key}
								name={key}
								value={inputProps[key]}
								defaultValue={defaultProps[key]}
								onChange={(value) =>
									dispatch({
										type: 'UPDATE_INPUT_PROP',
										key,
										value,
									})
								}
								onReset={() =>
									dispatch({
										type: 'RESET_INPUT_PROP',
										key,
									})
								}
							/>
						))
					)
				) : (
					<>
						<textarea
							value={jsonText}
							onChange={(e) =>
								handleJsonChange(e.target.value)
							}
							style={{
								width: '100%',
								height: '100%',
								boxSizing: 'border-box',
								background: colors.bgInput,
								color: colors.text,
								border: `1px solid ${jsonError ? colors.error : colors.border}`,
								borderRadius: 4,
								padding: 8,
								fontSize: 12,
								fontFamily: 'monospace',
								resize: 'none',
								outline: 'none',
							}}
						/>
						{jsonError && (
							<div
								style={{
									color: colors.error,
									fontSize: 11,
									marginTop: 4,
								}}
							>
								{jsonError}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
