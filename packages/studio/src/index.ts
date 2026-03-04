export { startServer, type StudioServerOptions } from './server.js';
export { Studio, type StudioProps } from './client/Studio.js';
export type { TrackDefinition, StudioState, StudioAction } from './client/store/types.js';
export type {
	EditorElement,
	EditorElementType,
	EditorTrack,
	EditorScene,
	SceneSettings,
	Transform,
	TextElement,
	SolidElement,
	ImageElement,
	VideoElement,
	AudioElement,
	Asset,
} from './client/editor/types.js';
export type { EditorAction } from './client/editor/editor-state.js';
