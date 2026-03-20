import Lock from 'models/Lock'

/**
 * Executes a function only if a distributed lock can be acquired.
 * If the lock exists and is not expired, it returns early.
 * @param name Unique name for the lock
 * @param durationSeconds How long the lock remains valid
 * @param fn The function to execute
 */
export async function withLock<T>(
  name: string,
  durationSeconds: number,
  fn: () => Promise<T>
): Promise<T | null> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + durationSeconds * 1000)

  try {
    // Attempt to create the lock. This is atomic.
    await Lock.create({ name, expiresAt })
    console.info(`[Lock] Acquired lock: ${name}`)
  } catch (err: any) {
    if (err.code === 11000) {
      // Duplicate key error - lock already held
      console.warn(`[Lock] Lock already held: ${name}. Skipping.`)
      return null
    }
    throw err
  }

  try {
    // Execute the function
    const result = await fn()
    return result
  } finally {
    // Clean up the lock immediately after execution
    // (TTL would clean it anyway, but this is better for short tasks)
    await Lock.deleteOne({ name })
    console.info(`[Lock] Released lock: ${name}`)
  }
}
