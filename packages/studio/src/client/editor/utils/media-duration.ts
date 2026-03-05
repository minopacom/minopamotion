/**
 * Detects the duration of a video or audio file in frames.
 * Returns a promise that resolves with the duration in frames.
 */
export async function getMediaDurationInFrames(
	src: string,
	fps: number,
	type: 'video' | 'audio',
): Promise<number> {
	return new Promise((resolve, reject) => {
		if (type === 'video') {
			const video = document.createElement('video');
			video.preload = 'metadata';

			video.onloadedmetadata = () => {
				const durationInSeconds = video.duration;
				const durationInFrames = Math.ceil(durationInSeconds * fps);
				video.remove();
				resolve(durationInFrames);
			};

			video.onerror = () => {
				video.remove();
				reject(new Error('Failed to load video metadata'));
			};

			video.src = src;
		} else if (type === 'audio') {
			const audio = document.createElement('audio');
			audio.preload = 'metadata';

			audio.onloadedmetadata = () => {
				const durationInSeconds = audio.duration;
				const durationInFrames = Math.ceil(durationInSeconds * fps);
				audio.remove();
				resolve(durationInFrames);
			};

			audio.onerror = () => {
				audio.remove();
				reject(new Error('Failed to load audio metadata'));
			};

			audio.src = src;
		} else {
			reject(new Error(`Unsupported media type: ${type}`));
		}
	});
}
