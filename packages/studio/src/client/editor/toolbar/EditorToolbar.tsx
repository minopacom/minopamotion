import React from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import { createTextElement, createSolidElement, createCaptionElement, createEditorTrack } from '../defaults.js';
import { colors } from '../../utils/colors.js';

export function EditorToolbar() {
	const { editorMode, editorScene } = useStudioState();
	const dispatch = useStudioDispatch();

	const addText = () => {
		// Create a new track for each element (matches asset library behavior)
		const trackNumber = editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });

		const element = createTextElement(track.id);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const addSolid = () => {
		// Create a new track for each element (matches asset library behavior)
		const trackNumber = editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });

		const element = createSolidElement(track.id);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const addCaption = () => {
		// Create a new track for each element (matches asset library behavior)
		const trackNumber = editorScene.tracks.length + 1;
		const track = createEditorTrack({ name: `Track ${trackNumber}` });
		dispatch({ type: 'ADD_EDITOR_TRACK', track });

		const element = createCaptionElement(track.id);
		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const [hoveredButton, setHoveredButton] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const importSubtitles = async (file: File) => {
		try {
			const text = await file.text();
			const { parseSubtitleFile, subtitlesToCaptions, createWordTimings } = await import('../../utils/subtitle-parser.js');
			
			const subtitles = parseSubtitleFile(text);
			
			if (subtitles.length === 0) {
				alert('No subtitles found in file. Please check the file format.');
				return;
			}

			console.log(`[Import] Found ${subtitles.length} subtitles`);

			// Get scene settings for FPS
			const fps = editorScene.settings.fps;

			// Create a track for captions
			const trackNumber = editorScene.tracks.length + 1;
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

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			importSubtitles(file);
			// Reset input so same file can be selected again
			e.target.value = '';
		}
	};

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
	};

	const toggleStyle: React.CSSProperties = {
		background: colors.bgInput,
		color: colors.text,
		border: `1px solid ${colors.border}`,
		padding: '6px 14px',
		fontSize: 11,
		cursor: 'pointer',
		transition: 'all 0.15s ease',
		fontWeight: 600,
		letterSpacing: '0.5px',
		textTransform: 'uppercase' as const,
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
			{/* Mode toggle */}
			<div style={{ display: 'flex', gap: 0, borderRadius: 6, overflow: 'hidden' }}>
				{(['code', 'editor'] as const).map((mode) => {
					const isActive =
						mode === 'editor' ? editorMode : !editorMode;
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
								...toggleStyle,
								background: isActive
									? colors.bgSelected
									: colors.bgInput,
								color: isActive
									? colors.textBright
									: colors.textDim,
								borderRadius: 0,
								borderLeft: mode === 'editor' ? 'none' : `1px solid ${colors.border}`,
								borderRight: mode === 'code' ? 'none' : `1px solid ${colors.border}`,
								borderTop: `1px solid ${colors.border}`,
								borderBottom: `1px solid ${colors.border}`,
							}}
						>
							{mode === 'code' ? 'Code' : 'Editor'}
						</button>
					);
				})}
			</div>

			{editorMode && (
				<>
					<div
						style={{
							width: 1,
							height: 24,
							background: colors.border,
						}}
					/>
					<button
						style={{
							...buttonStyle,
							background: hoveredButton === 'text' ? colors.bgHover : colors.bgInput,
							borderColor: hoveredButton === 'text' ? colors.borderLight : colors.border,
						}}
						onMouseEnter={() => setHoveredButton('text')}
						onMouseLeave={() => setHoveredButton(null)}
						onClick={addText}
					>
						✏️ Text
				</button>
				<button
					style={{
						...buttonStyle,
						background: hoveredButton === 'rect' ? colors.bgHover : colors.bgInput,
						borderColor: hoveredButton === 'rect' ? colors.borderLight : colors.border,
					}}
					onMouseEnter={() => setHoveredButton('rect')}
					onMouseLeave={() => setHoveredButton(null)}
					onClick={addSolid}
				>
					▭ Shape
				</button>
				<button
					style={{
						...buttonStyle,
						background: hoveredButton === 'caption' ? colors.bgHover : colors.bgInput,
						borderColor: hoveredButton === 'caption' ? colors.borderLight : colors.border,
					}}
					onMouseEnter={() => setHoveredButton('caption')}
					onMouseLeave={() => setHoveredButton(null)}
					onClick={addCaption}
				>
					💬 Caption
				</button>
				<button
					style={{
						...buttonStyle,
						background: hoveredButton === 'import' ? colors.bgHover : colors.bgInput,
						borderColor: hoveredButton === 'import' ? colors.borderLight : colors.border,
					}}
					onMouseEnter={() => setHoveredButton('import')}
					onMouseLeave={() => setHoveredButton(null)}
					onClick={() => fileInputRef.current?.click()}
				>
					📥 Import Subs
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept=".srt,.vtt"
					style={{ display: 'none' }}
					onChange={handleFileSelect}
				/>
			</>
		)}
	</div>
);
}
