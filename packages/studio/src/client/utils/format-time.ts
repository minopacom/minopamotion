export function formatTime(frame: number, fps: number): string {
	const totalSeconds = Math.floor(frame / fps);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	const remainingFrames = Math.floor(frame % fps);

	const mm = String(minutes).padStart(2, '0');
	const ss = String(seconds).padStart(2, '0');
	const ff = String(remainingFrames).padStart(2, '0');

	return `${mm}:${ss}.${ff}`;
}

export function formatFrameDisplay(
	frame: number,
	durationInFrames: number,
	fps: number,
): string {
	return `${formatTime(frame, fps)} / ${formatTime(durationInFrames, fps)}  (${frame} / ${durationInFrames})`;
}
