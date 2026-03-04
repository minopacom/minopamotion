import { describe, it, expect } from 'vitest';
import { studioReducer } from '../store/reducer.js';
import { createInitialState } from '../store/useStudioStore.js';
import type { StudioState } from '../store/types.js';
import type { TComposition } from '@minopamotion/core';

const makeComp = (overrides: Partial<TComposition> = {}): TComposition => ({
	id: 'test',
	component: () => null,
	durationInFrames: 100,
	fps: 30,
	width: 1920,
	height: 1080,
	defaultProps: { title: 'Hello', speed: 2 },
	nonce: 0,
	...overrides,
});

function init(comps: TComposition[] = [makeComp()]): StudioState {
	return createInitialState(comps);
}

describe('studioReducer', () => {
	it('creates initial state with first composition selected', () => {
		const state = init();
		expect(state.selectedCompositionId).toBe('test');
		expect(state.inputProps).toEqual({ title: 'Hello', speed: 2 });
		expect(state.currentFrame).toBe(0);
		expect(state.playing).toBe(false);
	});

	it('SELECT_COMPOSITION switches composition and resets frame', () => {
		const comp2 = makeComp({ id: 'comp2', defaultProps: { x: 1 } });
		let state = init([makeComp(), comp2]);
		state = { ...state, currentFrame: 50, playing: true };
		state = studioReducer(state, { type: 'SELECT_COMPOSITION', id: 'comp2' });
		expect(state.selectedCompositionId).toBe('comp2');
		expect(state.currentFrame).toBe(0);
		expect(state.playing).toBe(false);
		expect(state.inputProps).toEqual({ x: 1 });
	});

	it('SELECT_COMPOSITION with unknown id does nothing', () => {
		const state = init();
		const next = studioReducer(state, { type: 'SELECT_COMPOSITION', id: 'nope' });
		expect(next).toBe(state);
	});

	it('SET_FRAME clamps to valid range', () => {
		const state = init();
		let next = studioReducer(state, { type: 'SET_FRAME', frame: 50 });
		expect(next.currentFrame).toBe(50);

		next = studioReducer(state, { type: 'SET_FRAME', frame: 200 });
		expect(next.currentFrame).toBe(99);

		next = studioReducer(state, { type: 'SET_FRAME', frame: -10 });
		expect(next.currentFrame).toBe(0);
	});

	it('STEP_FRAME increments/decrements with clamping', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_FRAME', frame: 50 });
		state = studioReducer(state, { type: 'STEP_FRAME', delta: 10 });
		expect(state.currentFrame).toBe(60);

		state = studioReducer(state, { type: 'STEP_FRAME', delta: -100 });
		expect(state.currentFrame).toBe(0);
	});

	it('GO_TO_START respects in point', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_IN_POINT', frame: 20 });
		state = studioReducer(state, { type: 'SET_FRAME', frame: 50 });
		state = studioReducer(state, { type: 'GO_TO_START' });
		expect(state.currentFrame).toBe(20);
	});

	it('GO_TO_END respects out point', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_OUT_POINT', frame: 80 });
		state = studioReducer(state, { type: 'GO_TO_END' });
		expect(state.currentFrame).toBe(80);
	});

	it('TOGGLE_PLAY toggles playing', () => {
		let state = init();
		expect(state.playing).toBe(false);
		state = studioReducer(state, { type: 'TOGGLE_PLAY' });
		expect(state.playing).toBe(true);
		state = studioReducer(state, { type: 'TOGGLE_PLAY' });
		expect(state.playing).toBe(false);
	});

	it('TOGGLE_LOOP toggles loop', () => {
		let state = init();
		expect(state.loop).toBe(true);
		state = studioReducer(state, { type: 'TOGGLE_LOOP' });
		expect(state.loop).toBe(false);
	});

	it('TOGGLE_MUTE toggles muted', () => {
		let state = init();
		state = studioReducer(state, { type: 'TOGGLE_MUTE' });
		expect(state.muted).toBe(true);
	});

	it('SET_VOLUME clamps to [0, 1]', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_VOLUME', volume: 0.5 });
		expect(state.volume).toBe(0.5);

		state = studioReducer(state, { type: 'SET_VOLUME', volume: 2 });
		expect(state.volume).toBe(1);

		state = studioReducer(state, { type: 'SET_VOLUME', volume: -1 });
		expect(state.volume).toBe(0);
	});

	it('SET_PLAYBACK_RATE changes rate', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_PLAYBACK_RATE', rate: 2 });
		expect(state.playbackRate).toBe(2);
	});

	it('SET_PREVIEW_ZOOM changes zoom', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_PREVIEW_ZOOM', zoom: 150 });
		expect(state.previewZoom).toBe(150);
	});

	it('TOGGLE_CHECKERBOARD toggles', () => {
		let state = init();
		state = studioReducer(state, { type: 'TOGGLE_CHECKERBOARD' });
		expect(state.showCheckerboard).toBe(true);
	});

	it('SET_IN_POINT / SET_OUT_POINT / CLEAR_IN_OUT', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_IN_POINT', frame: 10 });
		expect(state.inPoint).toBe(10);

		state = studioReducer(state, { type: 'SET_OUT_POINT', frame: 90 });
		expect(state.outPoint).toBe(90);

		state = studioReducer(state, { type: 'CLEAR_IN_OUT' });
		expect(state.inPoint).toBeNull();
		expect(state.outPoint).toBeNull();
	});

	it('SET_TIMELINE_ZOOM clamps to [0.1, 10]', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_TIMELINE_ZOOM', zoom: 5 });
		expect(state.timelineZoom).toBe(5);

		state = studioReducer(state, { type: 'SET_TIMELINE_ZOOM', zoom: 0 });
		expect(state.timelineZoom).toBe(0.1);

		state = studioReducer(state, { type: 'SET_TIMELINE_ZOOM', zoom: 20 });
		expect(state.timelineZoom).toBe(10);
	});

	it('SET_LEFT_PANEL_WIDTH clamps to [150, 500]', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_LEFT_PANEL_WIDTH', width: 300 });
		expect(state.leftPanelWidth).toBe(300);

		state = studioReducer(state, { type: 'SET_LEFT_PANEL_WIDTH', width: 50 });
		expect(state.leftPanelWidth).toBe(150);

		state = studioReducer(state, { type: 'SET_LEFT_PANEL_WIDTH', width: 800 });
		expect(state.leftPanelWidth).toBe(500);
	});

	it('SET_RIGHT_PANEL_WIDTH clamps to [200, 600]', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_RIGHT_PANEL_WIDTH', width: 400 });
		expect(state.rightPanelWidth).toBe(400);
	});

	it('SET_TIMELINE_HEIGHT clamps to [100, 500]', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_TIMELINE_HEIGHT', height: 300 });
		expect(state.timelineHeight).toBe(300);

		state = studioReducer(state, { type: 'SET_TIMELINE_HEIGHT', height: 10 });
		expect(state.timelineHeight).toBe(100);
	});

	it('SET_PROPS_MODE switches between smart and json', () => {
		let state = init();
		state = studioReducer(state, { type: 'SET_PROPS_MODE', mode: 'json' });
		expect(state.propsMode).toBe('json');
	});

	it('UPDATE_INPUT_PROP updates a single prop', () => {
		let state = init();
		state = studioReducer(state, { type: 'UPDATE_INPUT_PROP', key: 'title', value: 'World' });
		expect(state.inputProps).toEqual({ title: 'World', speed: 2 });
	});

	it('RESET_INPUT_PROP resets to default', () => {
		let state = init();
		state = studioReducer(state, { type: 'UPDATE_INPUT_PROP', key: 'title', value: 'Changed' });
		state = studioReducer(state, { type: 'RESET_INPUT_PROP', key: 'title' });
		expect(state.inputProps.title).toBe('Hello');
	});

	it('overlay toggles', () => {
		let state = init();
		state = studioReducer(state, { type: 'SHOW_SHORTCUTS_HELP', show: true });
		expect(state.showShortcutsHelp).toBe(true);

		state = studioReducer(state, { type: 'SHOW_QUICK_SWITCHER', show: true });
		expect(state.showQuickSwitcher).toBe(true);

		state = studioReducer(state, { type: 'SHOW_RENDER_DIALOG', show: true });
		expect(state.showRenderDialog).toBe(true);
	});

	it('SET_TRACKS replaces tracks', () => {
		let state = init();
		const tracks = [{ id: 't1', label: 'Track 1', from: 0, durationInFrames: 30 }];
		state = studioReducer(state, { type: 'SET_TRACKS', tracks });
		expect(state.tracks).toEqual(tracks);
	});
});
