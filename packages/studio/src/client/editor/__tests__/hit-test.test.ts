import { describe, it, expect } from 'vitest';
import { pointInRotatedRect } from '../canvas/hit-test.js';
import type { Transform } from '../types.js';

function makeTransform(overrides: Partial<Transform> = {}): Transform {
	return {
		x: 0,
		y: 0,
		width: 100,
		height: 50,
		rotation: 0,
		opacity: 1,
		...overrides,
	};
}

describe('pointInRotatedRect', () => {
	it('detects point inside unrotated rect', () => {
		const t = makeTransform({ x: 10, y: 20 });
		expect(pointInRotatedRect(50, 40, t)).toBe(true);
	});

	it('detects point outside unrotated rect', () => {
		const t = makeTransform({ x: 10, y: 20 });
		expect(pointInRotatedRect(0, 0, t)).toBe(false);
	});

	it('detects point on edge of rect', () => {
		const t = makeTransform({ x: 0, y: 0, width: 100, height: 50 });
		expect(pointInRotatedRect(0, 0, t)).toBe(true);
		expect(pointInRotatedRect(100, 50, t)).toBe(true);
	});

	it('handles rotated rect - point inside', () => {
		// 100x50 rect centered at (50, 25), rotated 45 degrees
		const t = makeTransform({ x: 0, y: 0, rotation: 45 });
		// Center is always inside
		expect(pointInRotatedRect(50, 25, t)).toBe(true);
	});

	it('handles rotated rect - corner point moves outside', () => {
		// A 100x50 rect at origin, unrotated. Corner (100, 50) is inside.
		const tFlat = makeTransform({ x: 0, y: 0 });
		expect(pointInRotatedRect(100, 50, tFlat)).toBe(true);

		// When rotated 45 degrees, that same point may be outside
		const tRotated = makeTransform({ x: 0, y: 0, rotation: 45 });
		// (100, 50) relative to center (50, 25) => (50, 25)
		// Rotated by -45deg: roughly (53, -17.7)
		// Half-extents: 50, 25. |53| > 50, so outside
		expect(pointInRotatedRect(100, 50, tRotated)).toBe(false);
	});

	it('handles 90 degree rotation', () => {
		// 100x50 rect at origin, rotated 90 degrees
		// Center is at (50, 25)
		// After rotation, effective bounds are 50 wide and 100 tall
		const t = makeTransform({ rotation: 90 });
		// Point at center: should be inside
		expect(pointInRotatedRect(50, 25, t)).toBe(true);
		// Point at (50, 0) should be inside (within vertical extent of 100/2 = 50)
		expect(pointInRotatedRect(50, -20, t)).toBe(true);
		// Point way outside
		expect(pointInRotatedRect(200, 200, t)).toBe(false);
	});

	it('handles negative coordinates', () => {
		const t = makeTransform({ x: -50, y: -25 });
		expect(pointInRotatedRect(-25, 0, t)).toBe(true);
		expect(pointInRotatedRect(100, 100, t)).toBe(false);
	});
});
