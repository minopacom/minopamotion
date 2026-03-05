/**
 * Auto-captioning utilities using Web Speech API
 */

import type { CaptionElement, CaptionWord } from '../editor/types.js';

export interface TranscriptionWord {
	text: string;
	startTime: number; // in seconds
	endTime: number; // in seconds
	confidence?: number;
}

export interface TranscriptionSegment {
	text: string;
	words: TranscriptionWord[];
	startTime: number;
	endTime: number;
}

/**
 * Generate captions from audio/video files
 *
 * IMPORTANT: Browser's Web Speech API only works with LIVE microphone input,
 * NOT with audio/video files. To transcribe files, you need a backend service.
 *
 * For production use:
 * - OpenAI Whisper API (recommended)
 * - Google Cloud Speech-to-Text
 * - AssemblyAI
 * - Deepgram
 */
export async function generateCaptionsFromAudio(
	audioUrl: string,
	fps: number = 30,
): Promise<TranscriptionSegment[]> {
	// Web Speech API doesn't work with files - show helpful error
	throw new Error(
		'AUTO-CAPTIONING REQUIRES BACKEND SERVICE\n\n' +
		'Browser Limitation: Web Speech API only works with live microphone, not files.\n\n' +
		'Options:\n' +
		'1. Use "Import Subtitles" with SRT/VTT files (recommended for now)\n' +
		'2. Set up OpenAI Whisper API backend\n' +
		'3. Use external tools like https://openai.com/whisper to generate captions'
	);
}

/**
 * Convert transcription segments to caption elements
 */
export function transcriptionToCaptions(
	segments: TranscriptionSegment[],
	trackId: string,
	fps: number,
	styleOverrides?: Partial<CaptionElement>,
): Partial<CaptionElement>[] {
	return segments.map((segment) => {
		const fromFrame = Math.floor(segment.startTime * fps);
		const toFrame = Math.floor(segment.endTime * fps);
		const durationInFrames = toFrame - fromFrame;

		// Convert words to frame-based timing
		const words: CaptionWord[] = segment.words.map((word) => ({
			text: word.text,
			start: Math.floor((word.startTime - segment.startTime) * fps),
			duration: Math.floor((word.endTime - word.startTime) * fps),
		}));

		return {
			type: 'caption' as const,
			name: `Caption ${fromFrame}`,
			trackId,
			from: fromFrame,
			durationInFrames,
			text: segment.text,
			words,
			...styleOverrides,
		};
	});
}

/**
 * Better option: Use Whisper API for transcription
 * This requires a backend endpoint that calls OpenAI Whisper API
 */
export async function generateCaptionsWithWhisper(
	audioFile: File,
	apiEndpoint: string,
	fps: number = 30,
): Promise<TranscriptionSegment[]> {
	const formData = new FormData();
	formData.append('file', audioFile);
	formData.append('model', 'whisper-1');
	formData.append('response_format', 'verbose_json');
	formData.append('timestamp_granularities', JSON.stringify(['word']));

	try {
		const response = await fetch(apiEndpoint, {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Whisper API error: ${response.statusText}`);
		}

		const data = await response.json();

		// Convert Whisper response to our format
		const segments: TranscriptionSegment[] = [];

		if (data.words) {
			// Group words into segments (e.g., by sentences or time chunks)
			let currentSegment: TranscriptionWord[] = [];
			let segmentStart = 0;

			for (const word of data.words) {
				currentSegment.push({
					text: word.word,
					startTime: word.start,
					endTime: word.end,
					confidence: word.confidence,
				});

				// Create new segment every 5 seconds or at sentence boundaries
				const duration = word.end - segmentStart;
				const endsWithPunctuation = /[.!?]$/.test(word.word);

				if (duration >= 5 || endsWithPunctuation) {
					segments.push({
						text: currentSegment.map((w) => w.text).join(' '),
						words: currentSegment,
						startTime: segmentStart,
						endTime: word.end,
					});

					currentSegment = [];
					segmentStart = word.end;
				}
			}

			// Add remaining words
			if (currentSegment.length > 0) {
				const lastWord = currentSegment[currentSegment.length - 1];
				segments.push({
					text: currentSegment.map((w) => w.text).join(' '),
					words: currentSegment,
					startTime: segmentStart,
					endTime: lastWord.endTime,
				});
			}
		}

		return segments;
	} catch (error) {
		console.error('[Whisper] Error:', error);
		throw error;
	}
}
