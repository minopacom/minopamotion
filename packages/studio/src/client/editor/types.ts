export interface Transform {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	opacity: number;
}

interface BaseElement {
	id: string;
	name: string;
	trackId: string;
	from: number;
	durationInFrames: number;
	transform: Transform;
}

export interface TextElement extends BaseElement {
	type: 'text';
	text: string;
	fontSize: number;
	fontFamily: string;
	fontWeight: number;
	color: string;
	textAlign: 'left' | 'center' | 'right';
	lineHeight: number;
}

export interface SolidElement extends BaseElement {
	type: 'solid';
	color: string;
	borderRadius: number;
}

export interface ImageElement extends BaseElement {
	type: 'image';
	src: string;
	objectFit: 'cover' | 'contain' | 'fill';
}

export interface VideoElement extends BaseElement {
	type: 'video';
	src: string;
	objectFit: 'cover' | 'contain' | 'fill';
	volume: number;
	startFrom: number;
}

export interface AudioElement extends BaseElement {
	type: 'audio';
	src: string;
	volume: number;
	startFrom: number;
}

export type EditorElement =
	| TextElement
	| SolidElement
	| ImageElement
	| VideoElement
	| AudioElement;

export type EditorElementType = EditorElement['type'];

export interface EditorTrack {
	id: string;
	name: string;
	visible: boolean;
	locked: boolean;
	muted: boolean;
}

export interface Asset {
	id: string;
	name: string;
	type: 'image' | 'video' | 'audio';
	src: string;
}

export interface SceneSettings {
	width: number;
	height: number;
	fps: number;
	durationInFrames: number;
}

export interface EditorScene {
	settings: SceneSettings;
	elements: EditorElement[];
	tracks: EditorTrack[];
	assets: Asset[];
}
