import type {
	TextElement,
	SolidElement,
	ImageElement,
	VideoElement,
	AudioElement,
	CaptionElement,
	EditorTrack,
	Transform,
	Asset,
	Transitions,
} from './types.js';
import { generateId } from './id.js';

const defaultTransform: Transform = {
	x: 0,
	y: 0,
	width: 400,
	height: 200,
	rotation: 0,
	opacity: 1,
};

const defaultTransitions: Transitions = {
	in: null,
	out: null,
};

export function createTextElement(
	trackId: string,
	overrides?: Partial<TextElement>,
): TextElement {
	return {
		id: generateId(),
		type: 'text',
		name: 'Text',
		trackId,
		from: 0,
		durationInFrames: 150,
		transform: {
			...defaultTransform,
			x: 760, // Centered horizontally (1920/2 - 400/2)
			y: 440, // Centered vertically (1080/2 - 200/2)
			width: 400,
			height: 200,
		},
		transitions: { ...defaultTransitions },
		text: 'Add your text here',
		fontSize: 48,
		fontFamily: 'Arial, sans-serif',
		fontWeight: 700,
		color: '#6366f1', // Vibrant indigo - visible on any background
		textAlign: 'center',
		lineHeight: 1.2,
		...overrides,
	};
}

export function createSolidElement(
	trackId: string,
	overrides?: Partial<SolidElement>,
): SolidElement {
	return {
		id: generateId(),
		type: 'solid',
		name: 'Rectangle',
		trackId,
		from: 0,
		durationInFrames: 150,
		transform: {
			x: 760, // Centered horizontally (1920/2 - 400/2)
			y: 440, // Centered vertically (1080/2 - 200/2)
			width: 400,
			height: 200,
			rotation: 0,
			opacity: 1,
		},
		transitions: { ...defaultTransitions },
		color: '#6366f1', // Vibrant indigo
		borderRadius: 8,
		...overrides,
	};
}

export function createImageElement(
	trackId: string,
	src: string,
	overrides?: Partial<ImageElement>,
): ImageElement {
	return {
		id: generateId(),
		type: 'image',
		name: 'Image',
		trackId,
		from: 0,
		durationInFrames: 150,
		transform: { ...defaultTransform },
		transitions: { ...defaultTransitions },
		src,
		objectFit: 'contain',
		...overrides,
	};
}

export function createVideoElement(
	trackId: string,
	src: string,
	overrides?: Partial<VideoElement>,
): VideoElement {
	return {
		id: generateId(),
		type: 'video',
		name: 'Video',
		trackId,
		from: 0,
		durationInFrames: 150,
		transform: { ...defaultTransform },
		transitions: { ...defaultTransitions },
		src,
		objectFit: 'contain',
		volume: 1,
		startFrom: 0,
		...overrides,
	};
}

export function createAudioElement(
	trackId: string,
	src: string,
	overrides?: Partial<AudioElement>,
): AudioElement {
	return {
		id: generateId(),
		type: 'audio',
		name: 'Audio',
		trackId,
		from: 0,
		durationInFrames: 150,
		transform: { x: 0, y: 0, width: 100, height: 20, rotation: 0, opacity: 1 },
		transitions: { ...defaultTransitions },
		src,
		volume: 1,
		startFrom: 0,
		...overrides,
	};
}

export function createAsset(
	file: File,
	type: 'image' | 'video' | 'audio',
): Asset {
	return {
		id: generateId(),
		name: file.name,
		type,
		src: URL.createObjectURL(file),
	};
}

export function createCaptionElement(
	trackId: string,
	overrides?: Partial<CaptionElement>,
): CaptionElement {
	return {
		id: generateId(),
		type: 'caption',
		name: 'Caption',
		trackId,
		from: 0,
		durationInFrames: 90, // 3 seconds at 30fps
		transform: {
			x: 160, // 10% padding from left (1920 * 0.1 = 192, minus half width)
			y: 880, // Bottom position with padding
			width: 1600, // 80% of 1920 width
			height: 120,
			rotation: 0,
			opacity: 1,
		},
		transitions: { ...defaultTransitions },
		text: 'Add your caption here',
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
		highlightColor: '#facc15', // Yellow highlight for current word
		position: 'bottom',
		...overrides,
	};
}

export function createEditorTrack(
	overrides?: Partial<EditorTrack>,
): EditorTrack {
	return {
		id: generateId(),
		name: 'Track',
		visible: true,
		locked: false,
		muted: false,
		...overrides,
	};
}
