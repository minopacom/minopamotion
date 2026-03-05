import React, { useRef } from 'react';
import type { PlayerRef } from '@minopamotion/player';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { colors } from '../utils/colors.js';
import { Dropdown, DropdownItem, DropdownSeparator } from '../components/Dropdown.js';
import { createTextElement, createSolidElement, createCaptionElement, createEditorTrack, createAsset } from '../editor/defaults.js';
import { getMediaDurationInFrames } from '../editor/utils/media-duration.js';
import { getMediaDimensions, fitToCanvas } from '../editor/utils/fit-to-canvas.js';
import { createImageElement, createVideoElement, createAudioElement } from '../editor/defaults.js';
import type { TimelineTransitionEffect } from '../editor/types.js';

interface GroupedToolbarProps {
	playerRef: React.RefObject<PlayerRef | null>;
	leftPanelCollapsed?: boolean;
	onToggleLeftPanel?: () => void;
}

export function GroupedToolbar({ playerRef, leftPanelCollapsed, onToggleLeftPanel }: GroupedToolbarProps) {
	const state = useStudioState();
	const dispatch = useStudioDispatch();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const comp = state.compositions.find(
		(c) => c.id === state.selectedCompositionId,
	);

	const buttonStyle: React.CSSProperties = {
		background: colors.bgInput,
		color: colors.text,
		border: `1px solid ${colors.border}`,
		borderRadius: 6,
		padding: '6px 12px',
		fontSize: 12,
		cursor: 'pointer',
		transition: 'all 0.15s ease',
		fontWeight: 500,
		display: 'flex',
		alignItems: 'center',
		gap: 6,
	};

	// Add handlers
	const addText = () => {
		const trackNumber = state.editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });

		const element = createTextElement(track.id);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const addShape = () => {
		const trackNumber = state.editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });

		const element = createSolidElement(track.id);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const addCaption = () => {
		const trackNumber = state.editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });

		const element = createCaptionElement(track.id);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const subtitleFileInputRef = useRef<HTMLInputElement>(null);

	const importSubtitles = async (file: File) => {
		try {
			const text = await file.text();
			const { parseSubtitleFile, subtitlesToCaptions, createWordTimings } = await import('../utils/subtitle-parser.js');

			const subtitles = parseSubtitleFile(text);

			if (subtitles.length === 0) {
				alert('No subtitles found in file. Please check the file format.');
				return;
			}

			console.log(`[Import] Found ${subtitles.length} subtitles`);

			const fps = comp?.fps ?? 30;

			// Create a track for captions
			const trackNumber = state.editorScene.tracks.length + 1;
			const track = createEditorTrack({ name: `Captions ${trackNumber}` });
			dispatch({ type: 'ADD_EDITOR_TRACK', track });

			// Convert subtitles to caption elements
			const captionData = subtitlesToCaptions(subtitles, track.id, fps, {
				fontSize: 36,
				fontFamily: 'Arial, sans-serif',
				fontWeight: 700,
				color: '#ffffff',
				backgroundColor: '#000000',
				backgroundOpacity: 0.75,
				textAlign: 'center',
				lineHeight: 1.3,
				padding: 16,
				borderRadius: 8,
				highlightColor: '#facc15',
				position: 'bottom',
				transform: {
					x: 160,
					y: 880,
					width: 1600,
					height: 120,
					rotation: 0,
					opacity: 1,
				},
				transitions: { in: null, out: null },
			});

			// Add each caption with word timings
			captionData.forEach((captionPartial) => {
				const element = {
					id: `caption-${Date.now()}-${Math.random()}`,
					...captionPartial,
					words: createWordTimings(captionPartial.text || '', captionPartial.durationInFrames || 90),
				} as any;

				dispatch({ type: 'ADD_ELEMENT', element });
			});

			dispatch({ type: 'HISTORY_COMMIT' });
			alert(`Successfully imported ${subtitles.length} captions!`);
		} catch (error) {
			console.error('[Import] Error importing subtitles:', error);
			alert(`Error importing subtitles: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	const handleSubtitleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			importSubtitles(file);
			e.target.value = '';
		}
	};

	const autoCaptionFileInputRef = useRef<HTMLInputElement>(null);

	const handleAutoCaptionFile = async (file: File) => {
		try {
			const { generateCaptionsFromAudio, transcriptionToCaptions } = await import('../utils/auto-caption.js');

			// Show loading message
			const loadingMsg = 'Generating captions from audio... This may take a moment.';
			console.log(`[Auto-Caption] ${loadingMsg}`);
			alert(loadingMsg);

			const fps = comp?.fps ?? 30;

			// Create audio URL
			const audioUrl = URL.createObjectURL(file);

			// Generate transcription
			const segments = await generateCaptionsFromAudio(audioUrl, fps);

			// Clean up URL
			URL.revokeObjectURL(audioUrl);

			if (segments.length === 0) {
				alert('No speech detected in the audio. Please try a different file.');
				return;
			}

			console.log(`[Auto-Caption] Generated ${segments.length} caption segments`);

			// Create a track for captions
			const trackNumber = state.editorScene.tracks.length + 1;
			const track = createEditorTrack({ name: `Auto Captions ${trackNumber}` });
			dispatch({ type: 'ADD_EDITOR_TRACK', track });

			// Convert to caption elements
			const captionData = transcriptionToCaptions(segments, track.id, fps, {
				fontSize: 36,
				fontFamily: 'Arial, sans-serif',
				fontWeight: 700,
				color: '#ffffff',
				backgroundColor: '#000000',
				backgroundOpacity: 0.75,
				textAlign: 'center',
				lineHeight: 1.3,
				padding: 16,
				borderRadius: 8,
				highlightColor: '#facc15',
				position: 'bottom',
				transform: {
					x: 160,
					y: 880,
					width: 1600,
					height: 120,
					rotation: 0,
					opacity: 1,
				},
				transitions: { in: null, out: null },
			});

			// Add each caption
			captionData.forEach((captionPartial) => {
				const element = {
					id: `auto-caption-${Date.now()}-${Math.random()}`,
					...captionPartial,
				} as any;

				dispatch({ type: 'ADD_ELEMENT', element });
			});

			dispatch({ type: 'HISTORY_COMMIT' });
			alert(`Successfully generated ${segments.length} auto-captions!`);
		} catch (error) {
			console.error('[Auto-Caption] Error:', error);

			let errorMessage = 'Error generating auto-captions: ';
			if (error instanceof Error) {
				errorMessage += error.message;

				// Provide helpful hints for common errors
				if (error.message.includes('Web Speech API not supported')) {
					errorMessage += '\n\nTip: Use Chrome or Edge browser for auto-captioning.';
					errorMessage += '\n\nAlternatively, you can:';
					errorMessage += '\n1. Use "Import Subtitles" to import SRT/VTT files';
					errorMessage += '\n2. Use external tools like Whisper to generate captions';
				}
			} else {
				errorMessage += 'Unknown error';
			}

			alert(errorMessage);
		}
	};

	const handleAutoCaptionFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleAutoCaptionFile(file);
			e.target.value = '';
		}
	};

	const handleFileUpload = async (files: FileList | null) => {
		if (!files) return;

		const fps = comp?.fps ?? 30;
		const canvasWidth = comp?.width ?? 1920;
		const canvasHeight = comp?.height ?? 1080;

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
				continue;
			}

			// Create asset from file
			const asset = createAsset(file, assetType);

			// Add asset to library
			dispatch({ type: 'ADD_ASSET', asset });

			// Create a new track for this media
			const trackNumber = state.editorScene.tracks.length + 1;
			const track = createEditorTrack({ name: `Track ${trackNumber}` });
			dispatch({ type: 'ADD_EDITOR_TRACK', track });

			// Find the last frame of existing elements to place new element after
			const allElements = state.editorScene.tracks.flatMap((t) => t.elements ?? []);
			const startFrame = allElements.length > 0
				? Math.max(...allElements.map((el) => el.from + el.durationInFrames))
				: 0;

			// Create element with proper duration detection
			let element;
			if (assetType === 'image') {
				// Detect image dimensions and fit to canvas
				try {
					const { width, height } = await getMediaDimensions(asset.src, 'image');
					const fitted = fitToCanvas(width, height, canvasWidth, canvasHeight);

					element = createImageElement(track.id, asset.src, {
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
					element = createImageElement(track.id, asset.src, { from: startFrame });
				}
			} else if (assetType === 'video') {
				// Detect video duration and dimensions
				try {
					console.log('[Upload] Detecting video duration for:', file.name, 'fps:', fps);
					const durationInFrames = await getMediaDurationInFrames(asset.src, fps, 'video');
					console.log('[Upload] Detected video duration:', durationInFrames, 'frames (', durationInFrames / fps, 'seconds )');

					const { width, height } = await getMediaDimensions(asset.src, 'video');
					const fitted = fitToCanvas(width, height, canvasWidth, canvasHeight);

					element = createVideoElement(track.id, asset.src, {
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
					element = createVideoElement(track.id, asset.src, { from: startFrame });
				}
			} else {
				// Detect audio duration
				try {
					const durationInFrames = await getMediaDurationInFrames(asset.src, fps, 'audio');
					element = createAudioElement(track.id, asset.src, { from: startFrame, durationInFrames });
				} catch (error) {
					console.error('Failed to detect audio duration:', error);
					element = createAudioElement(track.id, asset.src, { from: startFrame });
				}
			}

			dispatch({ type: 'ADD_ELEMENT', element });
			dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });

			// Auto-extend composition duration if the element extends beyond current duration
			const elementEnd = element.from + element.durationInFrames;
			const currentDuration = state.editorScene.settings.durationInFrames;

			console.log('[Upload] Video uploaded:', {
				assetType,
				fileName: file.name,
				elementDuration: element.durationInFrames,
				elementEnd,
				currentDuration,
			});

			if (elementEnd > currentDuration) {
				// Add 30% padding for editing room (minimum 60 frames)
				const padding = Math.max(60, Math.floor(element.durationInFrames * 0.3));
				const newDuration = elementEnd + padding;

				console.log('[Upload] Extending composition duration from', currentDuration, 'to', newDuration);

				dispatch({
					type: 'UPDATE_SCENE_SETTINGS',
					settings: { durationInFrames: newDuration },
				});
			}

			dispatch({ type: 'HISTORY_COMMIT' });
		}
	};

	const addTransitionToTimeline = (effect: TimelineTransitionEffect) => {
		// Add transition at current playhead position
		const frame = state.currentFrame;
		const trackId = state.editorScene.tracks[0]?.id;

		if (!trackId) return;

		dispatch({
			type: 'ADD_TIMELINE_TRANSITION',
			transition: {
				id: `transition-${Date.now()}`,
				trackId,
				from: frame,
				durationInFrames: 30,
				effect,
			},
		});
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	return (
		<div
			style={{
				height: 56,
				background: colors.bgPanel,
				borderBottom: `1px solid ${colors.border}`,
				display: 'flex',
				alignItems: 'center',
				padding: '0 16px',
				gap: 12,
				flexShrink: 0,
				backdropFilter: 'blur(10px)',
				position: 'relative',
				zIndex: 100,
			}}
		>
			{/* Mode Toggle - Always visible */}
			<div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden' }}>
				{(['code', 'editor'] as const).map((mode) => {
					const isActive = mode === 'editor' ? state.editorMode : !state.editorMode;
					return (
						<button
							key={mode}
							onClick={() =>
								dispatch({
									type: 'SET_EDITOR_MODE',
									enabled: mode === 'editor',
								})
							}
							style={{
								background: isActive ? colors.bgSelected : colors.bgInput,
								color: isActive ? colors.textBright : colors.textDim,
								border: `1px solid ${colors.border}`,
								borderRadius: 0,
								borderLeft: mode === 'editor' ? 'none' : `1px solid ${colors.border}`,
								borderRight: mode === 'code' ? 'none' : `1px solid ${colors.border}`,
								padding: '6px 14px',
								fontSize: 11,
								cursor: 'pointer',
								transition: 'all 0.15s ease',
								fontWeight: 600,
								letterSpacing: '0.5px',
								textTransform: 'uppercase',
							}}
						>
							{mode === 'code' ? 'Code' : 'Editor'}
						</button>
					);
				})}
			</div>

			<div style={{ width: 1, height: 24, background: colors.border }} />

			{/* Add Dropdown */}
			{state.editorMode && (
				<Dropdown
					trigger={
						<button style={buttonStyle}>
							<span style={{ fontSize: 14 }}>+</span>
							<span>Add</span>
							<span style={{ fontSize: 10 }}>▾</span>
						</button>
					}
				>
					<DropdownItem
						icon="✏️"
						label="Text"
						description="Add text layer"
						onClick={addText}
					/>
					<DropdownItem
						icon="▭"
						label="Shape"
						description="Add solid color shape"
						onClick={addShape}
					/>
					<DropdownItem
						icon="💬"
						label="Caption"
						description="Add caption with word highlighting"
						onClick={addCaption}
					/>
					<DropdownSeparator />
					<DropdownItem
						icon="📁"
						label="Upload Media"
						description="Upload images, videos, audio"
						onClick={() => fileInputRef.current?.click()}
					/>
					<DropdownItem
						icon="📥"
						label="Import Subtitles"
						description="Import SRT/VTT subtitle files"
						onClick={() => subtitleFileInputRef.current?.click()}
					/>
					<DropdownItem
						icon="🎤"
						label="Auto Caption"
						description="Generate captions from audio/video"
						onClick={() => autoCaptionFileInputRef.current?.click()}
					/>
				</Dropdown>
			)}

			{/* Transitions Dropdown */}
			{state.editorMode && (
				<Dropdown
					trigger={
						<button style={buttonStyle}>
							<span style={{ fontSize: 14 }}>⨯</span>
							<span>Transitions</span>
							<span style={{ fontSize: 10 }}>▾</span>
						</button>
					}
				>
					<DropdownItem
						icon="⨯"
						label="Crossfade"
						onClick={() => addTransitionToTimeline('crossfade')}
					/>
					<DropdownItem
						icon="◐"
						label="Dissolve"
						onClick={() => addTransitionToTimeline('dissolve')}
					/>
					<DropdownSeparator />
					<DropdownItem
						icon="←"
						label="Wipe Left"
						onClick={() => addTransitionToTimeline('wipe-left')}
					/>
					<DropdownItem
						icon="→"
						label="Wipe Right"
						onClick={() => addTransitionToTimeline('wipe-right')}
					/>
					<DropdownItem
						icon="↑"
						label="Wipe Up"
						onClick={() => addTransitionToTimeline('wipe-up')}
					/>
					<DropdownItem
						icon="↓"
						label="Wipe Down"
						onClick={() => addTransitionToTimeline('wipe-down')}
					/>
					<DropdownSeparator />
					<DropdownItem
						icon="⇐"
						label="Slide Left"
						onClick={() => addTransitionToTimeline('slide-left')}
					/>
					<DropdownItem
						icon="⇒"
						label="Slide Right"
						onClick={() => addTransitionToTimeline('slide-right')}
					/>
					<DropdownSeparator />
					<DropdownItem
						icon="⊕"
						label="Zoom In"
						onClick={() => addTransitionToTimeline('zoom-in')}
					/>
					<DropdownItem
						icon="⊖"
						label="Zoom Out"
						onClick={() => addTransitionToTimeline('zoom-out')}
					/>
				</Dropdown>
			)}

			<div style={{ flex: 1 }} />

			{/* Composition Name */}
			{comp && (
				<span
					style={{
						fontSize: 11,
						color: colors.textDim,
						fontFamily: 'monospace',
						padding: '6px 10px',
						background: colors.glass,
						border: `1px solid ${colors.glassBorder}`,
						borderRadius: 6,
						fontWeight: 500,
					}}
				>
					{comp.id}
				</span>
			)}

			{/* View Controls */}
			<button
				style={{
					...buttonStyle,
					background: state.showCheckerboard ? colors.bgSelected : colors.bgInput,
					color: state.showCheckerboard ? colors.textBright : colors.text,
				}}
				onClick={() => dispatch({ type: 'TOGGLE_CHECKERBOARD' })}
			>
				Grid
			</button>

			{/* Render Button */}
			<button
				style={{
					background: colors.accentGradient,
					color: colors.textBright,
					border: 'none',
					borderRadius: 8,
					padding: '8px 20px',
					fontSize: 12,
					cursor: 'pointer',
					fontWeight: 600,
					transition: 'all 0.2s ease',
					boxShadow: `0 2px 8px rgba(99, 102, 241, 0.3)`,
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.transform = 'translateY(-1px)';
					e.currentTarget.style.boxShadow = `0 4px 12px rgba(99, 102, 241, 0.4)`;
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform = 'translateY(0)';
					e.currentTarget.style.boxShadow = `0 2px 8px rgba(99, 102, 241, 0.3)`;
				}}
				onClick={() => dispatch({ type: 'SHOW_RENDER_DIALOG', show: true })}
			>
				✨ Render
			</button>

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept="image/*,video/*,audio/*"
				style={{ display: 'none' }}
				onChange={(e) => handleFileUpload(e.target.files)}
			/>
			<input
				ref={subtitleFileInputRef}
				type="file"
				accept=".srt,.vtt"
				style={{ display: 'none' }}
				onChange={handleSubtitleFileSelect}
			/>
			<input
				ref={autoCaptionFileInputRef}
				type="file"
				accept="audio/*,video/*"
				style={{ display: 'none' }}
				onChange={handleAutoCaptionFileSelect}
			/>
		</div>
	);
}
