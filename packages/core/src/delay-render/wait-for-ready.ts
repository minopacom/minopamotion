export async function waitForReady(timeout = 30000): Promise<void> {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      if (typeof window !== 'undefined') {
        const cancelled = (window as unknown as Record<string, unknown>).remotion_cancelledError;
        if (cancelled) {
          reject(new Error(String(cancelled)));
          return;
        }

        if ((window as unknown as Record<string, unknown>).remotion_renderReady) {
          resolve();
          return;
        }
      }

      if (Date.now() - start > timeout) {
        reject(new Error(`Timed out waiting for render to be ready (${timeout}ms)`));
        return;
      }

      setTimeout(check, 16);
    };

    check();
  });
}
