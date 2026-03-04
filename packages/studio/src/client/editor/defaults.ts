import type {
	TextElement,
	SolidElement,
	ImageElement,
	VideoElement,
	AudioElement,
	EditorTrack,
	Transform,
	Asset,
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
		transform: { ...defaultTransform },
		text: 'Hello World',
		fontSize: 48,
		fontFamily: 'sans-serif',
		fontWeight: 700,
		color: '#ffffff',
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
		transform: { ...defaultTransform },
		color: '#3b82f6',
		borderRadius: 0,
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

export function createEditorTrack(
	overrides?: Partial<EditorTrack>,
): EditorTrack {
	return {
		id: generateId(),
		name: 'Track',
		visible: true,
		locked: false,
		...overrides,
	};
}
