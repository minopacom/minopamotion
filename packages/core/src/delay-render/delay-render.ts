interface DelayRenderHandle {
  id: number;
  label: string;
}

const handles: DelayRenderHandle[] = [];
let nextId = 0;

export function delayRender(label = 'delayRender'): number {
  const id = nextId++;
  handles.push({ id, label });
  updateReady();
  return id;
}

export function continueRender(handleId: number): void {
  const idx = handles.findIndex((h) => h.id === handleId);
  if (idx === -1) {
    throw new Error(`continueRender called with handle ${handleId} that does not exist`);
  }
  handles.splice(idx, 1);
  updateReady();
}

export function cancelRender(error: Error | string): void {
  const err = typeof error === 'string' ? new Error(error) : error;

  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).remotion_cancelledError = err.stack ?? err.message;
  }
}

function updateReady() {
  if (typeof window === 'undefined') return;
  (window as unknown as Record<string, unknown>).remotion_renderReady = handles.length === 0;
}
