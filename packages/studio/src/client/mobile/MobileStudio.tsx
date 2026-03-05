import React, { useState, useRef } from 'react';
import type { PlayerRef } from '@minopamotion/player';
import { useStudioState, useStudioDispatch } from '../store/context.js';
import { Preview } from '../preview/Preview.js';
import { colors } from '../utils/colors.js';

type MobileTab = 'preview' | 'timeline' | 'assets' | 'properties';

interface MobileStudioProps {
	playerRef: React.RefObject<PlayerRef | null>;
	activeComp: any;
}

export function MobileStudio({ playerRef, activeComp }: MobileStudioProps) {
	const [activeTab, setActiveTab] = useState<MobileTab>('preview');
	const state = useStudioState();
	const dispatch = useStudioDispatch();

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
				background: colors.bg,
				overflow: 'hidden',
			}}
		>
			{/* Mobile Header */}
			<div
				style={{
					height: 56,
					background: colors.bgPanel,
					borderBottom: `1px solid ${colors.border}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0 16px',
					flexShrink: 0,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<span style={{ fontSize: 20 }}>🎬</span>
					<h1 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: colors.textBright }}>
						Minopa
					</h1>
				</div>
				<button
					style={{
						background: colors.accentGradient,
						color: colors.textBright,
						border: 'none',
						borderRadius: 8,
						padding: '8px 16px',
						fontSize: 12,
						fontWeight: 600,
						cursor: 'pointer',
					}}
					onClick={() => dispatch({ type: 'SHOW_RENDER_DIALOG', show: true })}
				>
					Export
				</button>
			</div>

			{/* Content Area */}
			<div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
				{/* Preview Tab */}
				{activeTab === 'preview' && (
					<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
						{/* Preview */}
						<div style={{ flex: 1, overflow: 'hidden' }}>
							{activeComp ? (
								<Preview ref={playerRef} composition={activeComp} />
							) : (
								<div
									style={{
										width: '100%',
										height: '100%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: colors.textMuted,
									}}
								>
									No composition selected
								</div>
							)}
						</div>

						{/* Mobile Playback Controls */}
						<div
							style={{
								height: 80,
								background: colors.bgPanel,
								borderTop: `1px solid ${colors.border}`,
								display: 'flex',
								flexDirection: 'column',
								padding: '12px 16px',
								gap: 8,
							}}
						>
							{/* Timeline Scrubber */}
							<input
								type="range"
								min={0}
								max={activeComp?.durationInFrames || 100}
								value={state.currentFrame}
								onChange={(e) => {
									const frame = parseInt(e.target.value);
									dispatch({ type: 'SET_FRAME', frame });
									playerRef.current?.seekTo(frame);
								}}
								style={{
									width: '100%',
									height: 4,
									appearance: 'none',
									background: colors.bgInput,
									borderRadius: 2,
									outline: 'none',
								}}
							/>

							{/* Playback Buttons */}
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
								<button
									style={{
										background: 'transparent',
										border: 'none',
										color: colors.text,
										fontSize: 24,
										cursor: 'pointer',
										padding: 8,
									}}
									onClick={() => {
										const newFrame = Math.max(0, state.currentFrame - 10);
										dispatch({ type: 'SET_FRAME', frame: newFrame });
										playerRef.current?.seekTo(newFrame);
									}}
								>
									⏮️
								</button>
								<button
									style={{
										background: colors.accent,
										border: 'none',
										borderRadius: '50%',
										width: 48,
										height: 48,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: 20,
										cursor: 'pointer',
										boxShadow: `0 4px 12px ${colors.selectionGlow}`,
									}}
									onClick={() => {
										if (state.playing) {
											playerRef.current?.pause();
										} else {
											playerRef.current?.play();
										}
									}}
								>
									{state.playing ? '⏸️' : '▶️'}
								</button>
								<button
									style={{
										background: 'transparent',
										border: 'none',
										color: colors.text,
										fontSize: 24,
										cursor: 'pointer',
										padding: 8,
									}}
									onClick={() => {
										const newFrame = Math.min(
											activeComp?.durationInFrames || 0,
											state.currentFrame + 10
										);
										dispatch({ type: 'SET_FRAME', frame: newFrame });
										playerRef.current?.seekTo(newFrame);
									}}
								>
									⏭️
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Timeline Tab */}
				{activeTab === 'timeline' && (
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: 24,
							textAlign: 'center',
							color: colors.textMuted,
						}}
					>
						<div>
							<div style={{ fontSize: 48, marginBottom: 16 }}>🎞️</div>
							<p style={{ fontSize: 14 }}>Mobile timeline coming soon</p>
						</div>
					</div>
				)}

				{/* Assets Tab */}
				{activeTab === 'assets' && (
					<div
						style={{
							width: '100%',
							height: '100%',
							overflow: 'auto',
							padding: 16,
						}}
					>
						<div style={{ marginBottom: 16 }}>
							<button
								style={{
									width: '100%',
									background: colors.accentGradient,
									color: colors.textBright,
									border: 'none',
									borderRadius: 12,
									padding: '16px',
									fontSize: 14,
									fontWeight: 600,
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 8,
								}}
								onClick={() => {
									// Trigger file upload
									const input = document.createElement('input');
									input.type = 'file';
									input.accept = 'image/*,video/*,audio/*';
									input.multiple = true;
									input.click();
								}}
							>
								<span style={{ fontSize: 20 }}>📁</span>
								Upload Media
							</button>
						</div>

						{/* Assets Grid */}
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
								gap: 12,
							}}
						>
							{state.editorScene.assets.map((asset) => (
								<div
									key={asset.id}
									style={{
										aspectRatio: '1',
										background: colors.bgInput,
										borderRadius: 8,
										overflow: 'hidden',
										border: `1px solid ${colors.border}`,
									}}
								>
									{asset.type === 'image' && (
										<img
											src={asset.src}
											alt={asset.name}
											style={{ width: '100%', height: '100%', objectFit: 'cover' }}
										/>
									)}
									{asset.type === 'video' && (
										<video
											src={asset.src}
											style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
												fontSize: 32,
											}}
										>
											🎵
										</div>
									)}
								</div>
							))}
						</div>

						{state.editorScene.assets.length === 0 && (
							<div
								style={{
									textAlign: 'center',
									padding: 32,
									color: colors.textMuted,
									fontSize: 14,
								}}
							>
								No assets yet. Tap "Upload Media" to get started.
							</div>
						)}
					</div>
				)}

				{/* Properties Tab */}
				{activeTab === 'properties' && (
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: 24,
							textAlign: 'center',
							color: colors.textMuted,
						}}
					>
						<div>
							<div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
							<p style={{ fontSize: 14 }}>Properties panel coming soon</p>
						</div>
					</div>
				)}
			</div>

			{/* Bottom Navigation */}
			<div
				style={{
					height: 64,
					background: colors.bgPanel,
					borderTop: `1px solid ${colors.border}`,
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center',
					flexShrink: 0,
					paddingBottom: 'env(safe-area-inset-bottom, 0)',
				}}
			>
				{[
					{ id: 'preview' as const, icon: '▶️', label: 'Preview' },
					{ id: 'timeline' as const, icon: '🎞️', label: 'Timeline' },
					{ id: 'assets' as const, icon: '📁', label: 'Assets' },
					{ id: 'properties' as const, icon: '⚙️', label: 'Settings' },
				].map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						style={{
							flex: 1,
							background: 'transparent',
							border: 'none',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 4,
							padding: '8px',
							cursor: 'pointer',
							transition: 'all 0.2s ease',
							color: activeTab === tab.id ? colors.accent : colors.textMuted,
						}}
					>
						<span style={{ fontSize: 20 }}>{tab.icon}</span>
						<span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
					</button>
				))}
			</div>
		</div>
	);
}
