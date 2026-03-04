import React, { useRef } from 'react';
import { useStudioState, useStudioDispatch } from '../../store/context.js';
import {
	createAsset,
	createImageElement,
	createVideoElement,
	createAudioElement,
	createEditorTrack,
} from '../defaults.js';
import { colors } from '../../utils/colors.js';

export function AssetLibrary() {
	const { editorScene } = useStudioState();
	const dispatch = useStudioDispatch();
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	const handleAssetClick = (assetId: string) => {
		const asset = editorScene.assets.find((a) => a.id === assetId);
		if (!asset) return;

		// Ensure there's at least one track
		let trackId = editorScene.tracks[editorScene.tracks.length - 1]?.id;
		if (!trackId) {
			const track = createEditorTrack({ name: 'Track 1' });
			dispatch({ type: 'ADD_EDITOR_TRACK', track });
			trackId = track.id;
		}

		// Create element based on asset type
		let element;
		if (asset.type === 'image') {
			element = createImageElement(trackId, asset.src);
		} else if (asset.type === 'video') {
			element = createVideoElement(trackId, asset.src);
		} else {
			element = createAudioElement(trackId, asset.src);
		}

		dispatch({ type: 'ADD_ELEMENT', element });
		dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
		dispatch({ type: 'HISTORY_COMMIT' });
	};

	const handleDelete = (assetId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		dispatch({ type: 'REMOVE_ASSET', assetId });
		dispatch({ type: 'HISTORY_COMMIT' });
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
			{/* Header */}
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
					Assets
				</span>
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

			{/* Asset grid */}
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
		</div>
	);
}
