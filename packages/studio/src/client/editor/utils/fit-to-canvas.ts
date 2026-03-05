/**
 * Gets the natural dimensions of an image or video
 */
export async function getMediaDimensions(
	src: string,
	type: 'image' | 'video',
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		if (type === 'image') {
			const img = new Image();

			img.onload = () => {
				resolve({ width: img.naturalWidth, height: img.naturalHeight });
				img.remove();
			};

			img.onerror = () => {
				img.remove();
				reject(new Error('Failed to load image'));
			};

			img.src = src;
		} else if (type === 'video') {
			const video = document.createElement('video');
			video.preload = 'metadata';

			video.onloadedmetadata = () => {
				resolve({ width: video.videoWidth, height: video.videoHeight });
				video.remove();
			};

			video.onerror = () => {
				video.remove();
				reject(new Error('Failed to load video'));
			};

			video.src = src;
		} else {
			reject(new Error(`Unsupported media type: ${type}`));
		}
	});
}

/**
 * Calculates dimensions to fit media into canvas while maintaining aspect ratio
 */
export function fitToCanvas(
	mediaWidth: number,
	mediaHeight: number,
	canvasWidth: number,
	canvasHeight: number,
): { width: number; height: number; x: number; y: number } {
	const mediaAspect = mediaWidth / mediaHeight;
	const canvasAspect = canvasWidth / canvasHeight;

	let width: number;
	let height: number;

	if (mediaAspect > canvasAspect) {
		// Media is wider than canvas - fit to width
		width = canvasWidth;
		height = canvasWidth / mediaAspect;
	} else {
		// Media is taller than canvas - fit to height
		height = canvasHeight;
		width = canvasHeight * mediaAspect;
	}

	// Center the media
	const x = (canvasWidth - width) / 2;
	const y = (canvasHeight - height) / 2;

	return { width, height, x, y };
}
