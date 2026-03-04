import { describe, it, expect } from 'vitest';
import { detectPropType } from '../utils/detect-prop-type.js';

describe('detectPropType', () => {
	it('detects null/undefined', () => {
		expect(detectPropType(null)).toBe('null');
		expect(detectPropType(undefined)).toBe('null');
	});

	it('detects booleans', () => {
		expect(detectPropType(true)).toBe('boolean');
		expect(detectPropType(false)).toBe('boolean');
	});

	it('detects numbers', () => {
		expect(detectPropType(0)).toBe('number');
		expect(detectPropType(42)).toBe('number');
		expect(detectPropType(-3.14)).toBe('number');
	});

	it('detects plain strings', () => {
		expect(detectPropType('hello')).toBe('string');
		expect(detectPropType('')).toBe('string');
	});

	it('detects hex colors', () => {
		expect(detectPropType('#fff')).toBe('color');
		expect(detectPropType('#ff0000')).toBe('color');
		expect(detectPropType('#ff000080')).toBe('color');
	});

	it('detects rgb/rgba colors', () => {
		expect(detectPropType('rgb(255, 0, 0)')).toBe('color');
		expect(detectPropType('rgba(255, 0, 0, 0.5)')).toBe('color');
	});

	it('does not detect invalid hex as color', () => {
		expect(detectPropType('#xyz')).toBe('string');
		expect(detectPropType('#12345')).toBe('string');
	});

	it('detects arrays', () => {
		expect(detectPropType([])).toBe('array');
		expect(detectPropType([1, 2, 3])).toBe('array');
	});

	it('detects objects', () => {
		expect(detectPropType({})).toBe('object');
		expect(detectPropType({ a: 1 })).toBe('object');
	});
});
