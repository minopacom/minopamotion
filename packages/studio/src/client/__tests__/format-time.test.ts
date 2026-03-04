import { describe, it, expect } from 'vitest';
import { formatTime, formatFrameDisplay } from '../utils/format-time.js';

describe('formatTime', () => {
	it('formats 0 frames', () => {
		expect(formatTime(0, 30)).toBe('00:00.00');
	});

	it('formats frames within a second', () => {
		expect(formatTime(15, 30)).toBe('00:00.15');
	});

	it('formats exact seconds', () => {
		expect(formatTime(30, 30)).toBe('00:01.00');
		expect(formatTime(60, 30)).toBe('00:02.00');
	});

	it('formats minutes', () => {
		expect(formatTime(1800, 30)).toBe('01:00.00');
	});

	it('formats mixed', () => {
		expect(formatTime(1845, 30)).toBe('01:01.15');
	});

	it('works with 24fps', () => {
		expect(formatTime(48, 24)).toBe('00:02.00');
		expect(formatTime(25, 24)).toBe('00:01.01');
	});
});

describe('formatFrameDisplay', () => {
	it('returns combined time and frame count', () => {
		const result = formatFrameDisplay(45, 90, 30);
		expect(result).toContain('00:01.15');
		expect(result).toContain('00:03.00');
		expect(result).toContain('45');
		expect(result).toContain('90');
	});
});
