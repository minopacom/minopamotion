import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);

		// Set initial value
		setMatches(media.matches);

		// Create event listener
		const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

		// Add listener (using deprecated addListener for Safari < 14 compatibility)
		if (media.addEventListener) {
			media.addEventListener('change', listener);
		} else {
			media.addListener(listener);
		}

		// Cleanup
		return () => {
			if (media.removeEventListener) {
				media.removeEventListener('change', listener);
			} else {
				media.removeListener(listener);
			}
		};
	}, [query]);

	return matches;
}

// Common breakpoints
export const breakpoints = {
	mobile: '(max-width: 768px)',
	tablet: '(max-width: 1024px)',
	desktop: '(min-width: 1025px)',
	touch: '(hover: none) and (pointer: coarse)',
} as const;
