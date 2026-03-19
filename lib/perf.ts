export async function timeAsync<T>(
  label: string,
  fn: () => Promise<T>,
  thresholdMs = 500
): Promise<T> {
  const start = performance.now()
  try {
    return await fn()
  } finally {
    const ms = performance.now() - start
    if (ms >= thresholdMs) {
      console.log(`[slow] ${label} ${ms.toFixed(1)}ms`)
    }
  }
}
