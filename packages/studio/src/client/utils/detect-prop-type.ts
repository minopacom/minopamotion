export type PropType =
	| 'string'
	| 'number'
	| 'boolean'
	| 'color'
	| 'array'
	| 'object'
	| 'null';

const COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RGB_RE = /^rgba?\(\s*\d+/;

export function detectPropType(value: unknown): PropType {
	if (value === null || value === undefined) return 'null';
	if (typeof value === 'boolean') return 'boolean';
	if (typeof value === 'number') return 'number';
	if (typeof value === 'string') {
		if (COLOR_RE.test(value) || RGB_RE.test(value)) return 'color';
		return 'string';
	}
	if (Array.isArray(value)) return 'array';
	if (typeof value === 'object') return 'object';
	return 'string';
}
