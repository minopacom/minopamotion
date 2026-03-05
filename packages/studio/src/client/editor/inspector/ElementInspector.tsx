import React, { useState } from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { SceneSettings } from './SceneSettings.js';
import { LayoutSection } from './LayoutSection.js';
import { FillSection } from './FillSection.js';
import { TextSection } from './TextSection.js';
import { SolidSection } from './SolidSection.js';
import { MediaSection } from './MediaSection.js';
import { CaptionSection } from './CaptionSection.js';
import { TransitionControls } from './TransitionControls.js';
import { colors } from '../../utils/colors.js';
import type { StudioAction } from '../../store/types.js';
import type {
	TextElement,
	SolidElement,
	ImageElement,
	VideoElement,
	AudioElement,
	CaptionElement,
} from '../types.js';

type InspectorTab = 'video' | 'audio' | 'layout' | 'transitions';

export function ElementInspector() {
	const { editorScene, selectedElementIds } = useStudioState();
	const dispatch = useStudioDispatch();
	const [activeTab, setActiveTab] = useState<InspectorTab>('layout');

	if (selectedElementIds.length === 0) {
		return <SceneSettings />;
	}

	if (selectedElementIds.length > 1) {
		return (
			<div
				style={{
					padding: 16,
					color: colors.textMuted,
					fontSize: 12,
					textAlign: 'center',
				}}
			>
				{selectedElementIds.length} elements selected
			</div>
		);
	}

	const element = editorScene.elements.find(
		(el) => el.id === selectedElementIds[0],
	);
	if (!element) return null;

	const isMediaElement = element.type === 'video' || element.type === 'audio';
	const hasVideoTab = element.type === 'video' || element.type === 'image';

	// Render tabbed interface for video/audio elements
	if (isMediaElement) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				{/* Element name */}
				<div style={{ padding: 8, paddingBottom: 0 }}>
					<input
						type="text"
						value={element.name}
						onChange={(e) =>
							dispatch({
								type: 'UPDATE_ELEMENT',
								id: element.id,
								updates: { name: e.target.value },
							})
						}
						onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
						style={{
							background: colors.bgInput,
							color: colors.textBright,
							border: `1px solid ${colors.border}`,
							borderRadius: 3,
							padding: '4px 8px',
							fontSize: 13,
							fontWeight: 600,
							outline: 'none',
							width: '100%',
						}}
					/>
				</div>

				{/* Tab switcher */}
				<div
					style={{
						display: 'flex',
						gap: 2,
						padding: '8px 8px 0 8px',
						borderBottom: `1px solid ${colors.border}`,
					}}
				>
					{hasVideoTab && (
						<button
							onClick={() => setActiveTab('video')}
							style={{
								flex: 1,
								padding: '6px 12px',
								fontSize: 11,
								fontWeight: 600,
								background: activeTab === 'video' ? colors.bgSelected : colors.bgInput,
								color: activeTab === 'video' ? colors.textBright : colors.textDim,
								border: `1px solid ${activeTab === 'video' ? colors.accent : colors.border}`,
								borderBottom: activeTab === 'video' ? `2px solid ${colors.accent}` : '1px solid transparent',
								borderRadius: '4px 4px 0 0',
								cursor: 'pointer',
								transition: 'all 0.15s ease',
							}}
						>
							🎥 Video
						</button>
					)}
					<button
						onClick={() => setActiveTab('audio')}
						style={{
							flex: 1,
							padding: '6px 12px',
							fontSize: 11,
							fontWeight: 600,
							background: activeTab === 'audio' ? colors.bgSelected : colors.bgInput,
							color: activeTab === 'audio' ? colors.textBright : colors.textDim,
							border: `1px solid ${activeTab === 'audio' ? colors.accent : colors.border}`,
							borderBottom: activeTab === 'audio' ? `2px solid ${colors.accent}` : '1px solid transparent',
							borderRadius: '4px 4px 0 0',
							cursor: 'pointer',
							transition: 'all 0.15s ease',
						}}
					>
						🔊 Audio
					</button>
					<button
						onClick={() => setActiveTab('layout')}
						style={{
							flex: 1,
							padding: '6px 12px',
							fontSize: 11,
							fontWeight: 600,
							background: activeTab === 'layout' ? colors.bgSelected : colors.bgInput,
							color: activeTab === 'layout' ? colors.textBright : colors.textDim,
							border: `1px solid ${activeTab === 'layout' ? colors.accent : colors.border}`,
							borderBottom: activeTab === 'layout' ? `2px solid ${colors.accent}` : '1px solid transparent',
							borderRadius: '4px 4px 0 0',
							cursor: 'pointer',
							transition: 'all 0.15s ease',
						}}
					>
						📐 Layout
					</button>
					<button
						onClick={() => setActiveTab('transitions')}
						style={{
							flex: 1,
							padding: '6px 12px',
							fontSize: 11,
							fontWeight: 600,
							background: activeTab === 'transitions' ? colors.bgSelected : colors.bgInput,
							color: activeTab === 'transitions' ? colors.textBright : colors.textDim,
							border: `1px solid ${activeTab === 'transitions' ? colors.accent : colors.border}`,
							borderBottom: activeTab === 'transitions' ? `2px solid ${colors.accent}` : '1px solid transparent',
							borderRadius: '4px 4px 0 0',
							cursor: 'pointer',
							transition: 'all 0.15s ease',
						}}
					>
						✨ Transitions
					</button>
				</div>

				{/* Tab content */}
				<div
					style={{
						flex: 1,
						overflowY: 'auto',
						padding: 8,
					}}
				>
					{activeTab === 'video' && hasVideoTab && (
						<VideoTabContent
							element={element as VideoElement | ImageElement}
							dispatch={dispatch}
						/>
					)}
					{activeTab === 'audio' && (
						<AudioTabContent
							element={element as VideoElement | AudioElement}
							dispatch={dispatch}
						/>
					)}
					{activeTab === 'layout' && (
						<>
							<LayoutSection element={element} dispatch={dispatch} />
							<div style={{ height: 1, background: colors.border, margin: '12px 0' }} />
							<FillSection element={element} dispatch={dispatch} />
						</>
					)}
					{activeTab === 'transitions' && (
						<TransitionControls
							elementId={element.id}
							transitions={element.transitions}
							dispatch={dispatch}
						/>
					)}
				</div>
			</div>
		);
	}

	// Render standard inspector for text/solid elements
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				padding: 8,
			}}
		>
			{/* Element name */}
			<input
				type="text"
				value={element.name}
				onChange={(e) =>
					dispatch({
						type: 'UPDATE_ELEMENT',
						id: element.id,
						updates: { name: e.target.value },
					})
				}
				onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
				style={{
					background: colors.bgInput,
					color: colors.textBright,
					border: `1px solid ${colors.border}`,
					borderRadius: 3,
					padding: '4px 8px',
					fontSize: 13,
					fontWeight: 600,
					outline: 'none',
				}}
			/>

			<div
				style={{
					height: 1,
					background: colors.border,
				}}
			/>

			<LayoutSection element={element} dispatch={dispatch} />

			<div style={{ height: 1, background: colors.border }} />

			<FillSection element={element} dispatch={dispatch} />

			<div style={{ height: 1, background: colors.border }} />

			{element.type === 'text' && (
				<TextSection
					element={element as TextElement}
					dispatch={dispatch}
				/>
			)}
			{element.type === 'solid' && (
				<SolidSection
					element={element as SolidElement}
					dispatch={dispatch}
				/>
			)}
			{element.type === 'caption' && (
				<CaptionSection
					element={element as CaptionElement}
					dispatch={dispatch}
				/>
			)}

			<div style={{ height: 1, background: colors.border }} />

			<TransitionControls
				elementId={element.id}
				transitions={element.transitions}
				dispatch={dispatch}
			/>
		</div>
	);
}

// Video tab content component
function VideoTabContent({
	element,
	dispatch,
}: {
	element: VideoElement | ImageElement;
	dispatch: React.Dispatch<StudioAction>;
}) {
	const update = (updates: Partial<typeof element>) => {
		dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates });
	};

	const hasStartFrom = element.type === 'video';

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
			<label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				<span style={{ fontSize: 10, color: colors.textDim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
					Source
				</span>
				<input
					type="text"
					value={element.src}
					onChange={(e) => update({ src: e.target.value })}
					onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
					style={{
						background: colors.bgInput,
						color: colors.text,
						border: `1px solid ${colors.border}`,
						borderRadius: 4,
						padding: '6px 10px',
						fontSize: 11,
						fontFamily: 'monospace',
						outline: 'none',
					}}
				/>
			</label>

			<label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				<span style={{ fontSize: 10, color: colors.textDim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
					Object Fit
				</span>
				<select
					value={element.objectFit}
					onChange={(e) => {
						update({ objectFit: e.target.value as 'cover' | 'contain' | 'fill' });
						dispatch({ type: 'HISTORY_COMMIT' });
					}}
					style={{
						background: colors.bgInput,
						color: colors.text,
						border: `1px solid ${colors.border}`,
						borderRadius: 4,
						padding: '6px 10px',
						fontSize: 12,
						outline: 'none',
						cursor: 'pointer',
					}}
				>
					<option value="contain">Contain</option>
					<option value="cover">Cover</option>
					<option value="fill">Fill</option>
				</select>
			</label>

			{hasStartFrom && (
				<label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
					<span style={{ fontSize: 10, color: colors.textDim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
						Start From (frames)
					</span>
					<input
						type="number"
						value={(element as VideoElement).startFrom}
						min={0}
						onChange={(e) => update({ startFrom: Math.max(0, Number(e.target.value)) })}
						onBlur={() => dispatch({ type: 'HISTORY_COMMIT' })}
						style={{
							background: colors.bgInput,
							color: colors.text,
							border: `1px solid ${colors.border}`,
							borderRadius: 4,
							padding: '6px 10px',
							fontSize: 12,
							fontFamily: 'monospace',
							outline: 'none',
						}}
					/>
				</label>
			)}
		</div>
	);
}

// Audio tab content component
function AudioTabContent({
	element,
	dispatch,
}: {
	element: VideoElement | AudioElement;
	dispatch: React.Dispatch<StudioAction>;
}) {
	const update = (updates: Partial<typeof element>) => {
		dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates });
	};

	const isMuted = element.volume === 0;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<span style={{ fontSize: 10, color: colors.textDim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
						Volume
					</span>
					<button
						onClick={() => {
							update({ volume: isMuted ? 1 : 0 });
							dispatch({ type: 'HISTORY_COMMIT' });
						}}
						style={{
							background: isMuted ? colors.error : colors.bgInput,
							color: isMuted ? colors.textBright : colors.text,
							border: `1px solid ${isMuted ? colors.error : colors.border}`,
							borderRadius: 4,
							padding: '4px 10px',
							fontSize: 11,
							fontWeight: 600,
							cursor: 'pointer',
							transition: 'all 0.15s ease',
						}}
					>
						{isMuted ? '🔇 Muted' : '🔊 Unmuted'}
					</button>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<input
						type="range"
						min={0}
						max={100}
						value={Math.round(element.volume * 100)}
						onChange={(e) => update({ volume: Number(e.target.value) / 100 })}
						onMouseUp={() => dispatch({ type: 'HISTORY_COMMIT' })}
						disabled={isMuted}
						style={{
							flex: 1,
							opacity: isMuted ? 0.5 : 1,
						}}
					/>
					<span
						style={{
							fontSize: 13,
							color: isMuted ? colors.textMuted : colors.text,
							fontFamily: 'monospace',
							fontWeight: 600,
							minWidth: 40,
							textAlign: 'right',
						}}
					>
						{Math.round(element.volume * 100)}%
					</span>
				</div>
			</div>

			<div style={{
				background: colors.bgInput,
				border: `1px solid ${colors.border}`,
				borderRadius: 4,
				padding: 12,
				fontSize: 11,
				color: colors.textDim,
				lineHeight: 1.5,
			}}>
				<div style={{ marginBottom: 8, fontWeight: 600, color: colors.text }}>💡 Audio Controls</div>
				<div>• Use the slider to adjust volume from 0% to 100%</div>
				<div>• Click the mute button to quickly toggle audio</div>
				<div>• Volume changes are committed to history on release</div>
			</div>
		</div>
	);
}
