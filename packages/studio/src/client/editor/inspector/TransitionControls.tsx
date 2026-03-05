import React from 'react';
import type { Transitions, TransitionType, EasingType } from '../types.js';
import type { EditorAction } from '../editor-state.js';
import { colors } from '../../utils/colors.js';

interface TransitionControlsProps {
	elementId: string;
	transitions: Transitions;
	dispatch: React.Dispatch<EditorAction>;
}

const transitionTypes: { value: TransitionType; label: string }[] = [
	{ value: 'none', label: 'None' },
	{ value: 'fade', label: 'Fade' },
	{ value: 'slide-left', label: 'Slide Left' },
	{ value: 'slide-right', label: 'Slide Right' },
	{ value: 'slide-up', label: 'Slide Up' },
	{ value: 'slide-down', label: 'Slide Down' },
	{ value: 'scale', label: 'Scale' },
	{ value: 'zoom', label: 'Zoom' },
	{ value: 'rotate', label: 'Rotate' },
	{ value: 'wipe-left', label: 'Wipe Left' },
	{ value: 'wipe-right', label: 'Wipe Right' },
];

const easingTypes: { value: EasingType; label: string }[] = [
	{ value: 'linear', label: 'Linear' },
	{ value: 'ease', label: 'Ease' },
	{ value: 'ease-in', label: 'Ease In' },
	{ value: 'ease-out', label: 'Ease Out' },
	{ value: 'ease-in-out', label: 'Ease In/Out' },
	{ value: 'quad', label: 'Quad' },
	{ value: 'cubic', label: 'Cubic' },
	{ value: 'bounce', label: 'Bounce' },
	{ value: 'elastic', label: 'Elastic' },
	{ value: 'back', label: 'Back' },
];

const sectionStyle: React.CSSProperties = {
	marginBottom: 20,
	padding: 16,
	background: colors.bgTertiary,
	borderRadius: 8,
	border: `1px solid ${colors.border}`,
};

const sectionTitleStyle: React.CSSProperties = {
	fontSize: 13,
	fontWeight: 600,
	color: colors.textBright,
	marginBottom: 12,
	display: 'flex',
	alignItems: 'center',
	gap: 6,
};

const controlGroupStyle: React.CSSProperties = {
	marginBottom: 12,
};

const labelStyle: React.CSSProperties = {
	display: 'block',
	fontSize: 11,
	color: colors.textMuted,
	marginBottom: 4,
	fontWeight: 500,
};

const selectStyle: React.CSSProperties = {
	width: '100%',
	padding: '6px 8px',
	fontSize: 12,
	background: colors.bgPrimary,
	color: colors.text,
	border: `1px solid ${colors.border}`,
	borderRadius: 4,
	cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
	width: '100%',
	padding: '6px 8px',
	fontSize: 12,
	background: colors.bgPrimary,
	color: colors.text,
	border: `1px solid ${colors.border}`,
	borderRadius: 4,
};

const checkboxContainerStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	marginBottom: 12,
};

const checkboxStyle: React.CSSProperties = {
	cursor: 'pointer',
};

export function TransitionControls({
	elementId,
	transitions,
	dispatch,
}: TransitionControlsProps) {
	const handleTransitionInToggle = (enabled: boolean) => {
		dispatch({
			type: 'UPDATE_ELEMENT_TRANSITION_IN',
			id: elementId,
			transition: enabled
				? { type: 'fade', durationInFrames: 15, easing: 'ease-out' }
				: null,
		});
	};

	const handleTransitionOutToggle = (enabled: boolean) => {
		dispatch({
			type: 'UPDATE_ELEMENT_TRANSITION_OUT',
			id: elementId,
			transition: enabled
				? { type: 'fade', durationInFrames: 15, easing: 'ease-in' }
				: null,
		});
	};

	const handleTransitionInType = (type: TransitionType) => {
		if (!transitions.in) return;
		dispatch({
			type: 'UPDATE_ELEMENT_TRANSITION_IN',
			id: elementId,
			transition: { ...transitions.in, type },
		});
	};

	const handleTransitionOutType = (type: TransitionType) => {
		if (!transitions.out) return;
		dispatch({
			type: 'UPDATE_ELEMENT_TRANSITION_OUT',
			id: elementId,
			transition: { ...transitions.out, type },
		});
	};

	const handleTransitionInDuration = (durationInFrames: number) => {
		if (!transitions.in) return;
		dispatch({
			type: 'UPDATE_ELEMENT_TRANSITION_IN',
			id: elementId,
			transition: { ...transitions.in, durationInFrames },
		});
	};

	const handleTransitionOutDuration = (durationInFrames: number) => {
		if (!transitions.out) return;
		dispatch({
			type: 'UPDATE_ELEMENT_TRANSITION_OUT',
			id: elementId,
			transition: { ...transitions.out, durationInFrames },
		});
	};

	const handleTransitionInEasing = (easing: EasingType) => {
		if (!transitions.in) return;
		dispatch({
			type: 'UPDATE_ELEMENT_TRANSITION_IN',
			id: elementId,
			transition: { ...transitions.in, easing },
		});
	};

	const handleTransitionOutEasing = (easing: EasingType) => {
		if (!transitions.out) return;
		dispatch({
			type: 'UPDATE_ELEMENT_TRANSITION_OUT',
			id: elementId,
			transition: { ...transitions.out, easing },
		});
	};

	return (
		<div>
			{/* Transition In */}
			<div style={sectionStyle}>
				<div style={sectionTitleStyle}>
					<span>📥</span>
					<span>Transition In</span>
				</div>

				<div style={checkboxContainerStyle}>
					<input
						type="checkbox"
						checked={transitions.in !== null}
						onChange={(e) => handleTransitionInToggle(e.target.checked)}
						style={checkboxStyle}
					/>
					<label style={{ fontSize: 12, color: colors.text }}>
						Enable entrance transition
					</label>
				</div>

				{transitions.in && (
					<>
						<div style={controlGroupStyle}>
							<label style={labelStyle}>Effect</label>
							<select
								value={transitions.in.type}
								onChange={(e) =>
									handleTransitionInType(e.target.value as TransitionType)
								}
								style={selectStyle}
							>
								{transitionTypes.map((t) => (
									<option key={t.value} value={t.value}>
										{t.label}
									</option>
								))}
							</select>
						</div>

						<div style={controlGroupStyle}>
							<label style={labelStyle}>Duration (frames)</label>
							<input
								type="number"
								min={1}
								max={120}
								value={transitions.in.durationInFrames}
								onChange={(e) =>
									handleTransitionInDuration(parseInt(e.target.value) || 15)
								}
								style={inputStyle}
							/>
						</div>

						<div style={controlGroupStyle}>
							<label style={labelStyle}>Easing</label>
							<select
								value={transitions.in.easing}
								onChange={(e) =>
									handleTransitionInEasing(e.target.value as EasingType)
								}
								style={selectStyle}
							>
								{easingTypes.map((e) => (
									<option key={e.value} value={e.value}>
										{e.label}
									</option>
								))}
							</select>
						</div>
					</>
				)}
			</div>

			{/* Transition Out */}
			<div style={sectionStyle}>
				<div style={sectionTitleStyle}>
					<span>📤</span>
					<span>Transition Out</span>
				</div>

				<div style={checkboxContainerStyle}>
					<input
						type="checkbox"
						checked={transitions.out !== null}
						onChange={(e) => handleTransitionOutToggle(e.target.checked)}
						style={checkboxStyle}
					/>
					<label style={{ fontSize: 12, color: colors.text }}>
						Enable exit transition
					</label>
				</div>

				{transitions.out && (
					<>
						<div style={controlGroupStyle}>
							<label style={labelStyle}>Effect</label>
							<select
								value={transitions.out.type}
								onChange={(e) =>
									handleTransitionOutType(e.target.value as TransitionType)
								}
								style={selectStyle}
							>
								{transitionTypes.map((t) => (
									<option key={t.value} value={t.value}>
										{t.label}
									</option>
								))}
							</select>
						</div>

						<div style={controlGroupStyle}>
							<label style={labelStyle}>Duration (frames)</label>
							<input
								type="number"
								min={1}
								max={120}
								value={transitions.out.durationInFrames}
								onChange={(e) =>
									handleTransitionOutDuration(parseInt(e.target.value) || 15)
								}
								style={inputStyle}
							/>
						</div>

						<div style={controlGroupStyle}>
							<label style={labelStyle}>Easing</label>
							<select
								value={transitions.out.easing}
								onChange={(e) =>
									handleTransitionOutEasing(e.target.value as EasingType)
								}
								style={selectStyle}
							>
								{easingTypes.map((e) => (
									<option key={e.value} value={e.value}>
										{e.label}
									</option>
								))}
							</select>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
