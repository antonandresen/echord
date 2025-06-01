interface QueuedRequest {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
  execute: () => Promise<unknown>
}

/**
 * Queue for managing rate-limited requests
 */
export class RequestQueue {
  private readonly limit: number
  private queue: QueuedRequest[] = []
  private processing = false
  private remaining: number
  private reset: number

  constructor(_bucket: string, limit: number) {
    this.limit = limit
    this.remaining = limit
    this.reset = Date.now()
  }

  /**
   * Add a request to the queue
   */
  public add<T>(execute: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        resolve: (value) => resolve(value as T),
        reject,
        execute: execute as () => Promise<unknown>,
      })

      if (!this.processing) {
        this.process().catch((error) => {
          console.error('Error processing queue:', error)
        })
      }
    })
  }

  /**
   * Update rate limit information
   */
  public updateRateLimit(remaining: number, reset: number): void {
    this.remaining = remaining
    this.reset = reset
  }

  /**
   * Process the queue
   */
  private async process(): Promise<void> {
    if (this.processing) return

    this.processing = true

    try {
      while (this.queue.length > 0) {
        if (this.remaining <= 0) {
          const now = Date.now()
          if (now < this.reset) {
            await this.sleep(this.reset - now)
            this.remaining = this.limit
          }
        }

        const request = this.queue.shift()
        if (!request) continue

        try {
          const result = await request.execute()
          request.resolve(result)
          this.remaining--
        } catch (error) {
          if (error instanceof Error) {
            request.reject(error)
          } else {
            request.reject(new Error('Unknown error occurred'))
          }
        }
      }
    } finally {
      this.processing = false
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
