import type { Transform } from '../types.js';

/**
 * Test if a point (px, py) is inside a rotated rectangle defined by a Transform.
 * Translate point relative to rect center, rotate by -rotation, check axis-aligned bounds.
 * Includes a tolerance/padding to make selection easier.
 */
export function pointInRotatedRect(
	px: number,
	py: number,
	transform: Transform,
	tolerance: number = 30, // Add 30px padding around elements for easier selection
): boolean {
	const cx = transform.x + transform.width / 2;
	const cy = transform.y + transform.height / 2;

	// Translate point to rect center
	const dx = px - cx;
	const dy = py - cy;

	// Rotate point by -rotation
	const radians = (-transform.rotation * Math.PI) / 180;
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);
	const rx = dx * cos - dy * sin;
	const ry = dx * sin + dy * cos;

	// Check axis-aligned bounds with tolerance for easier clicking
	const hw = transform.width / 2 + tolerance;
	const hh = transform.height / 2 + tolerance;
	return Math.abs(rx) <= hw && Math.abs(ry) <= hh;
}
