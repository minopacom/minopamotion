export const colors = {
	// Ultra-modern dark theme - inspired by Linear, Vercel, Raycast
	bg: '#0a0a0a',
	bgLight: '#111111',
	bgLighter: '#1a1a1a',
	bgPanel: '#0f0f0f',
	bgInput: '#1a1a1a',
	bgHover: '#252525',
	bgSelected: '#6366f1',
	bgSelectedHover: '#7c3aed',

	border: '#222222',
	borderLight: '#2a2a2a',
	borderFocus: '#6366f1',

	text: '#ededed',
	textDim: '#a1a1a1',
	textMuted: '#737373',
	textBright: '#ffffff',

	// Vibrant gradient accent - modern and eye-catching
	accent: '#6366f1',
	accentLight: '#818cf8',
	accentDark: '#4f46e5',
	accentGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',

	// Secondary accent - cyan/teal for variety
	accentSecondary: '#06b6d4',
	accentSecondaryLight: '#22d3ee',

	// Vibrant playhead - neon red
	playhead: '#ff3b6d',
	playheadGlow: 'rgba(255, 59, 109, 0.3)',

	// Modern track colors - vibrant gradients
	trackColors: [
		'#6366f1', // Indigo
		'#8b5cf6', // Purple
		'#ec4899', // Pink
		'#f59e0b', // Amber
		'#10b981', // Emerald
		'#06b6d4', // Cyan
		'#f97316', // Orange
		'#a855f7', // Violet
	],

	checkerLight: '#171717',
	checkerDark: '#0d0d0d',

	overlay: 'rgba(0, 0, 0, 0.85)',
	overlayLight: 'rgba(0, 0, 0, 0.65)',
	overlayBlur: 'rgba(0, 0, 0, 0.75)',

	error: '#ff3b6d',
	success: '#10b981',
	warning: '#f59e0b',
	info: '#06b6d4',

	// Editor canvas - modern, glowing selection
	selection: '#6366f1',
	selectionGlow: 'rgba(99, 102, 241, 0.25)',
	handle: '#ffffff',
	handleBorder: '#6366f1',
	snapGuide: '#a855f7',

	// Glassmorphism effects
	glass: 'rgba(255, 255, 255, 0.05)',
	glassBorder: 'rgba(255, 255, 255, 0.1)',
} as const;
