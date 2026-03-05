export const colors = {
	// Modern dark theme - inspired by Figma, VS Code
	bg: '#0d0d0d',
	bgLight: '#1a1a1a',
	bgLighter: '#242424',
	bgPanel: '#161616',
	bgInput: '#232323',
	bgHover: '#2a2a2a',
	bgSelected: '#2563eb',
	bgSelectedHover: '#3b82f6',

	border: '#2a2a2a',
	borderLight: '#3a3a3a',
	borderFocus: '#3b82f6',

	text: '#e5e5e5',
	textDim: '#9ca3af',
	textMuted: '#6b7280',
	textBright: '#ffffff',

	// Modern blue accent - cleaner, more professional
	accent: '#3b82f6',
	accentLight: '#60a5fa',
	accentDark: '#2563eb',

	// Vibrant playhead - stands out on timeline
	playhead: '#ef4444',
	playheadGlow: 'rgba(239, 68, 68, 0.25)',

	// Modern track colors - vibrant but professional
	trackColors: [
		'#3b82f6', // Blue
		'#8b5cf6', // Purple
		'#ec4899', // Pink
		'#f59e0b', // Amber
		'#10b981', // Emerald
		'#06b6d4', // Cyan
		'#f97316', // Orange
		'#84cc16', // Lime
	],

	checkerLight: '#1f1f1f',
	checkerDark: '#141414',

	overlay: 'rgba(0, 0, 0, 0.8)',
	overlayLight: 'rgba(0, 0, 0, 0.6)',

	error: '#ef4444',
	success: '#10b981',
	warning: '#f59e0b',

	// Editor canvas - modern, clear selection
	selection: '#3b82f6',
	selectionGlow: 'rgba(59, 130, 246, 0.2)',
	handle: '#ffffff',
	handleBorder: '#3b82f6',
	snapGuide: '#ec4899',
} as const;
