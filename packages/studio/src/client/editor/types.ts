export interface Transform {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	opacity: number;
}

export type TransitionType =
	| 'none'
	| 'fade'
	| 'slide-left'
	| 'slide-right'
	| 'slide-up'
	| 'slide-down'
	| 'scale'
	| 'zoom'
	| 'rotate'
	| 'wipe-left'
	| 'wipe-right';

export type EasingType =
	| 'linear'
	| 'ease'
	| 'ease-in'
	| 'ease-out'
	| 'ease-in-out'
	| 'quad'
	| 'cubic'
	| 'bounce'
	| 'elastic'
	| 'back';

export interface Transition {
	type: TransitionType;
	durationInFrames: number;
	easing: EasingType;
}

export interface Transitions {
	in: Transition | null;
	out: Transition | null;
}

interface BaseElement {
	id: string;
	name: string;
	trackId: string;
	from: number;
	durationInFrames: number;
	transform: Transform;
	transitions: Transitions;
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

export interface CaptionWord {
	text: string;
	start: number; // Start time in frames relative to caption start
	duration: number; // Duration in frames
}

export interface CaptionElement extends BaseElement {
	type: 'caption';
	text: string;
	words?: CaptionWord[]; // For word-by-word highlighting
	fontSize: number;
	fontFamily: string;
	fontWeight: number;
	color: string;
	backgroundColor: string;
	backgroundOpacity: number;
	textAlign: 'left' | 'center' | 'right';
	lineHeight: number;
	padding: number;
	borderRadius: number;
	highlightColor?: string; // Color for current word highlight
	position: 'top' | 'center' | 'bottom'; // Quick positioning
}

export type EditorElement =
	| TextElement
	| SolidElement
	| ImageElement
	| VideoElement
	| AudioElement
	| CaptionElement;

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

export type TimelineTransitionEffect =
	| 'crossfade'
	| 'dissolve'
	| 'wipe-left'
	| 'wipe-right'
	| 'wipe-up'
	| 'wipe-down'
	| 'slide-left'
	| 'slide-right'
	| 'zoom-in'
	| 'zoom-out';

export interface TimelineTransitionItem {
	id: string;
	/** Track ID where the transition is placed (can be any track) */
	trackId: string;
	/** Frame where transition starts (absolute) */
	from: number;
	/** Duration of transition in frames */
	durationInFrames: number;
	/** Type of transition effect */
	effect: TimelineTransitionEffect;
	/** ID of element before transition (fading out) - optional for cross-track */
	beforeElementId?: string;
	/** ID of element after transition (fading in) - optional for cross-track */
	afterElementId?: string;
}

export interface EditorScene {
	settings: SceneSettings;
	elements: EditorElement[];
	tracks: EditorTrack[];
	assets: Asset[];
	timelineTransitions: TimelineTransitionItem[];
}
