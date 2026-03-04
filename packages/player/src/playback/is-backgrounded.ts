export function isBackgrounded(): boolean {
  if (typeof document === 'undefined') return false;
  return document.visibilityState === 'hidden';
}

export function onVisibilityChange(callback: (hidden: boolean) => void): () => void {
  if (typeof document === 'undefined') return () => {};

  const handler = () => callback(document.visibilityState === 'hidden');
  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
}
