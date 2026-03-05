import React, { useRef, useState } from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import {
	createAsset,
	createImageElement,
	createVideoElement,
	createAudioElement,
	createEditorTrack,
} from '../defaults.js';
import { getMediaDurationInFrames } from '../utils/media-duration.js';
import { getMediaDimensions, fitToCanvas } from '../utils/fit-to-canvas.js';
import { colors } from '../../utils/colors.js';
import type { TimelineTransitionEffect } from '../types.js';

type LibraryTab = 'media' | 'transitions';

const transitionOptions: Array<{ effect: TimelineTransitionEffect; label: string; icon: string }> = [
	{ effect: 'crossfade', label: 'Crossfade', icon: '⨯' },
	{ effect: 'dissolve', label: 'Dissolve', icon: '◐' },
	{ effect: 'wipe-left', label: 'Wipe Left', icon: '←' },
	{ effect: 'wipe-right', label: 'Wipe Right', icon: '→' },
	{ effect: 'wipe-up', label: 'Wipe Up', icon: '↑' },
	{ effect: 'wipe-down', label: 'Wipe Down', icon: '↓' },
	{ effect: 'slide-left', label: 'Slide Left', icon: '⇐' },
	{ effect: 'slide-right', label: 'Slide Right', icon: '⇒' },
	{ effect: 'zoom-in', label: 'Zoom In', icon: '⊕' },
	{ effect: 'zoom-out', label: 'Zoom Out', icon: '⊖' },
];

export function AssetLibrary() {
	const { editorScene, compositions, selectedCompositionId } = useStudioState();
	const dispatch = useStudioDispatch();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [activeTab, setActiveTab] = useState<LibraryTab>('media');

	const handleFileUpload = (files: FileList | null) => {
		if (!files) return;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const fileType = file.type;

			let assetType: 'image' | 'video' | 'audio';
			if (fileType.startsWith('image/')) {
				assetType = 'image';
			} else if (fileType.startsWith('video/')) {
				assetType = 'video';
			} else if (fileType.startsWith('audio/')) {
				assetType = 'audio';
			} else {
				continue; // Skip unsupported files
			}

			const asset = createAsset(file, assetType);
			dispatch({ type: 'ADD_ASSET', asset });
		}

		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const handleAssetClick = async (assetId: string) => {
		const asset = editorScene.assets.find((a) => a.id === assetId);
		if (!asset) return;

		// Get composition to know the FPS
		const comp = compositions.find((c) => c.id === selectedCompositionId);
		const fps = comp?.fps ?? 30;

		// Create a new track for each media item (professional editor behavior)
		const trackNumber = editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });
		const trackId = track.id;

		// New media always starts at frame 0 on its own track
		const startFrame = 0;

		// Get canvas dimensions
		const canvasWidth = editorScene.settings.width;
		const canvasHeight = editorScene.settings.height;

		// Create element based on asset type
		let element;
		if (asset.type === 'image') {
			// Detect image dimensions and fit to canvas
			try {
				const { width, height } = await getMediaDimensions(asset.src, 'image');
				const fitted = fitToCanvas(width, height, canvasWidth, canvasHeight);

				element = createImageElement(trackId, asset.src, {
					from: startFrame,
					transform: {
						x: fitted.x,
						y: fitted.y,
						width: fitted.width,
						height: fitted.height,
						rotation: 0,
						opacity: 1,
					},
				});
			} catch (error) {
				console.error('Failed to detect image dimensions:', error);
				element = createImageElement(trackId, asset.src, { from: startFrame });
			}
		} else if (asset.type === 'video') {
			// Detect video duration and dimensions
			try {
				const durationInFrames = await getMediaDurationInFrames(
					asset.src,
					fps,
					'video',
				);
				const { width, height } = await getMediaDimensions(asset.src, 'video');
				const fitted = fitToCanvas(width, height, canvasWidth, canvasHeight);

				element = createVideoElement(trackId, asset.src, {
					from: startFrame,
					durationInFrames,
					transform: {
						x: fitted.x,
						y: fitted.y,
						width: fitted.width,
						height: fitted.height,
						rotation: 0,
						opacity: 1,
					},
				});
			} catch (error) {
				console.error('Failed to detect video properties:', error);
				element = createVideoElement(trackId, asset.src, { from: startFrame });
			}
		} else {
			// Detect audio duration
			try {
				const durationInFrames = await getMediaDurationInFrames(
					asset.src,
					fps,
					'audio',
				);
				element = createAudioElement(trackId, asset.src, { from: startFrame, durationInFrames });
			} catch (error) {
				console.error('Failed to detect audio duration:', error);
				element = createAudioElement(trackId, asset.src, { from: startFrame });
			}
		}

		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });

		// Auto-extend composition duration if the element extends beyond current duration
		const elementEnd = element.from + element.durationInFrames;
		const currentDuration = editorScene.settings.durationInFrames;

		if (elementEnd > currentDuration) {
			// Add 30% padding for editing room (minimum 60 frames)
			const padding = Math.max(60, Math.floor(element.durationInFrames * 0.3));
			const newDuration = elementEnd + padding;

			dispatch({
				type: 'UPDATE_SCENE_SETTINGS',
				settings: { durationInFrames: newDuration },
			});
		}

		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const handleDelete = (assetId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		dispatch({ type: 'REMOVE_ASSET', assetId });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const handleTransitionDragStart = (e: React.DragEvent, effect: TimelineTransitionEffect) => {
		e.dataTransfer.setData('application/transition', effect);
		e.dataTransfer.effectAllowed = 'copy';
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				background: colors.bgPanel,
			}}
		>
			{/* Header with tabs */}
			<div
				style={{
					padding: 8,
					borderBottom: `1px solid ${colors.border}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', gap: 4 }}>
					<button
						onClick={() => setActiveTab('media')}
						style={{
							background: activeTab === 'media' ? colors.accent : 'transparent',
							color: activeTab === 'media' ? colors.textBright : colors.textDim,
							border: 'none',
							borderRadius: 3,
							padding: '4px 8px',
							fontSize: 10,
							cursor: 'pointer',
							fontWeight: 600,
							textTransform: 'uppercase',
							letterSpacing: 0.5,
						}}
					>
						Media
					</button>
					<button
						onClick={() => setActiveTab('transitions')}
						style={{
							background: activeTab === 'transitions' ? colors.accent : 'transparent',
							color: activeTab === 'transitions' ? colors.textBright : colors.textDim,
							border: 'none',
							borderRadius: 3,
							padding: '4px 8px',
							fontSize: 10,
							cursor: 'pointer',
							fontWeight: 600,
							textTransform: 'uppercase',
							letterSpacing: 0.5,
						}}
					>
						Transitions
					</button>
				</div>
				{activeTab === 'media' && (
					<button
						onClick={() => fileInputRef.current?.click()}
						style={{
							background: colors.accent,
							color: colors.textBright,
							border: 'none',
							borderRadius: 3,
							padding: '3px 8px',
							fontSize: 10,
							cursor: 'pointer',
							fontWeight: 600,
						}}
					>
						+ Upload
					</button>
				)}
			</div>

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept="image/*,video/*,audio/*"
				style={{ display: 'none' }}
				onChange={(e) => handleFileUpload(e.target.files)}
			/>

			{/* Content area - Media tab */}
			{activeTab === 'media' && (
				<div
					style={{
						flex: 1,
						overflowY: 'auto',
						padding: 8,
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
						gap: 8,
						alignContent: 'start',
					}}
				>
					{editorScene.assets.length === 0 ? (
						<div
							style={{
								gridColumn: '1 / -1',
								padding: 16,
								textAlign: 'center',
								color: colors.textMuted,
								fontSize: 11,
							}}
						>
							No assets. Click "+ Upload" to add media.
						</div>
					) : (
						editorScene.assets.map((asset) => (
							<div
								key={asset.id}
								onClick={() => handleAssetClick(asset.id)}
								style={{
									position: 'relative',
									aspectRatio: '1',
									background: colors.bgInput,
									borderRadius: 4,
									overflow: 'hidden',
									cursor: 'pointer',
									border: `1px solid ${colors.border}`,
								}}
							>
								{/* Thumbnail */}
								{asset.type === 'image' && (
									<img
										src={asset.src}
										alt={asset.name}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
									/>
								)}
								{asset.type === 'video' && (
									<video
										src={asset.src}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
									/>
								)}
								{asset.type === 'audio' && (
									<div
										style={{
											width: '100%',
											height: '100%',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 24,
										}}
									>
										🎵
									</div>
								)}

								{/* Delete button */}
								<button
									onClick={(e) => handleDelete(asset.id, e)}
									style={{
										position: 'absolute',
										top: 2,
										right: 2,
										background: 'rgba(0,0,0,0.7)',
										color: colors.textBright,
										border: 'none',
										borderRadius: 3,
										width: 18,
										height: 18,
										fontSize: 12,
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									×
								</button>

								{/* Name */}
								<div
									style={{
										position: 'absolute',
										bottom: 0,
										left: 0,
										right: 0,
										background: 'rgba(0,0,0,0.7)',
										color: colors.textBright,
										fontSize: 9,
										padding: 2,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
									title={asset.name}
								>
									{asset.name}
								</div>
							</div>
						))
					)}
				</div>
			)}

			{/* Content area - Transitions tab */}
			{activeTab === 'transitions' && (
				<div
					style={{
						flex: 1,
						overflowY: 'auto',
						padding: 8,
						display: 'flex',
						flexDirection: 'column',
						gap: 6,
					}}
				>
					<div
						style={{
							fontSize: 10,
							color: colors.textMuted,
							padding: '4px 0',
						}}
					>
						Drag transitions onto the timeline
					</div>
					{transitionOptions.map((option) => (
						<div
							key={option.effect}
							draggable
							onDragStart={(e) => handleTransitionDragStart(e, option.effect)}
							style={{
								background: 'linear-gradient(135deg, #7c3aed88 0%, #a855f7AA 100%)',
								border: `1px solid ${colors.border}`,
								borderRadius: 4,
								padding: '8px 12px',
								cursor: 'grab',
								display: 'flex',
								alignItems: 'center',
								gap: 8,
								fontSize: 11,
								color: colors.textBright,
								fontWeight: 500,
								userSelect: 'none',
								transition: 'transform 0.1s ease',
							}}
							onMouseDown={(e) => {
								e.currentTarget.style.transform = 'scale(0.98)';
							}}
							onMouseUp={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'scale(1)';
							}}
						>
							<span style={{ fontSize: 16 }}>{option.icon}</span>
							<span>{option.label}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
