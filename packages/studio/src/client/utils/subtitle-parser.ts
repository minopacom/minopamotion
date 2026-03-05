import type { CaptionElement, CaptionWord } from '../editor/types.js';

export interface ParsedSubtitle {
	index: number;
	startTime: number; // in seconds
	endTime: number; // in seconds
	text: string;
}

/**
 * Parse SRT subtitle format
 * Example:
 * 1
 * 00:00:00,500 --> 00:00:02,000
 * Hello world
 */
export function parseSRT(content: string): ParsedSubtitle[] {
	const subtitles: ParsedSubtitle[] = [];
	const blocks = content.trim().split(/\n\s*\n/);

	for (const block of blocks) {
		const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
		if (lines.length < 3) continue;

		const index = parseInt(lines[0], 10);
		const timeLine = lines[1];
		const text = lines.slice(2).join('\n');

		const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
		if (!timeMatch) continue;

		const startTime =
			parseInt(timeMatch[1]) * 3600 +
			parseInt(timeMatch[2]) * 60 +
			parseInt(timeMatch[3]) +
			parseInt(timeMatch[4]) / 1000;

		const endTime =
			parseInt(timeMatch[5]) * 3600 +
			parseInt(timeMatch[6]) * 60 +
			parseInt(timeMatch[7]) +
			parseInt(timeMatch[8]) / 1000;

		subtitles.push({ index, startTime, endTime, text });
	}

	return subtitles;
}

/**
 * Parse VTT subtitle format
 * Example:
 * WEBVTT
 *
 * 00:00:00.500 --> 00:00:02.000
 * Hello world
 */
export function parseVTT(content: string): ParsedSubtitle[] {
	const subtitles: ParsedSubtitle[] = [];
	const lines = content.split('\n');

	let index = 0;
	let currentBlock: string[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Skip WEBVTT header and empty lines
		if (line === '' || line.startsWith('WEBVTT') || line.startsWith('NOTE')) {
			if (currentBlock.length > 0) {
				// Process previous block
				const subtitle = parseVTTBlock(currentBlock, index++);
				if (subtitle) subtitles.push(subtitle);
				currentBlock = [];
			}
			continue;
		}

		currentBlock.push(line);
	}

	// Process last block
	if (currentBlock.length > 0) {
		const subtitle = parseVTTBlock(currentBlock, index);
		if (subtitle) subtitles.push(subtitle);
	}

	return subtitles;
}

function parseVTTBlock(lines: string[], index: number): ParsedSubtitle | null {
	// Find the time line (format: 00:00:00.500 --> 00:00:02.000)
	let timeLineIndex = -1;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('-->')) {
			timeLineIndex = i;
			break;
		}
	}

	if (timeLineIndex === -1) return null;

	const timeLine = lines[timeLineIndex];
	const text = lines.slice(timeLineIndex + 1).join('\n');

	const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
	if (!timeMatch) return null;

	const startTime =
		parseInt(timeMatch[1]) * 3600 +
		parseInt(timeMatch[2]) * 60 +
		parseInt(timeMatch[3]) +
		parseInt(timeMatch[4]) / 1000;

	const endTime =
		parseInt(timeMatch[5]) * 3600 +
		parseInt(timeMatch[6]) * 60 +
		parseInt(timeMatch[7]) +
		parseInt(timeMatch[8]) / 1000;

	return { index, startTime, endTime, text };
}

/**
 * Convert subtitle file content to caption elements
 */
export function subtitlesToCaptions(
	subtitles: ParsedSubtitle[],
	trackId: string,
	fps: number,
	overrides?: Partial<CaptionElement>
): Partial<CaptionElement>[] {
	return subtitles.map((sub) => ({
		type: 'caption' as const,
		name: `Caption ${sub.index}`,
		trackId,
		from: Math.round(sub.startTime * fps),
		durationInFrames: Math.round((sub.endTime - sub.startTime) * fps),
		text: sub.text,
		...overrides,
	}));
}

/**
 * Split text into words with timing (for word-by-word highlighting)
 * This is a simple even distribution - could be enhanced with speech recognition
 */
export function createWordTimings(
	text: string,
	durationInFrames: number
): CaptionWord[] {
	const words = text.split(/\s+/).filter(Boolean);
	if (words.length === 0) return [];

	const framesPerWord = Math.floor(durationInFrames / words.length);

	return words.map((word, index) => ({
		text: word,
		start: index * framesPerWord,
		duration: framesPerWord,
	}));
}

/**
 * Auto-detect subtitle format and parse
 */
export function parseSubtitleFile(content: string): ParsedSubtitle[] {
	// Check if it's VTT (starts with WEBVTT)
	if (content.trim().startsWith('WEBVTT')) {
		return parseVTT(content);
	}

	// Otherwise assume SRT
	return parseSRT(content);
}
