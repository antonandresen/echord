import { Collection } from '../utils/Collection'

export interface CacheOptions {
  /**
   * Maximum number of entries to store in the cache
   */
  maxSize?: number

  /**
   * Time in milliseconds after which entries should be considered expired
   */
  ttl?: number | null

  /**
   * Interval in milliseconds at which to sweep expired entries
   */
  sweepInterval?: number | null

  /**
   * Custom sweep filter function
   */
  sweepFilter?: <K, V>(
    value: V,
    key: K,
    collection: Collection<K, V>,
  ) => boolean
}

/**
 * Base cache implementation with LRU and TTL support
 */
export class BaseCache<K, V> extends Collection<K, V> {
  private readonly maxSize: number
  private readonly ttl: number | null
  private readonly sweepInterval: number | null
  private readonly sweepFilter?: <K, V>(
    value: V,
    key: K,
    collection: Collection<K, V>,
  ) => boolean
  private sweepTimer: NodeJS.Timeout | null = null
  private readonly accessOrder: Map<K, number> = new Map()
  private readonly ttls: Map<K, number> = new Map()

  constructor(options: CacheOptions = {}) {
    super()
    this.maxSize = options.maxSize ?? Infinity
    this.ttl = options.ttl ?? null
    this.sweepInterval = options.sweepInterval ?? null
    this.sweepFilter = options.sweepFilter

    if (this.sweepInterval !== null && this.sweepInterval > 0) {
      this.sweepTimer = setInterval(() => this.sweep(), this.sweepInterval)
    }
  }

  /**
   * Get a value from the cache
   * @param key The key to get
   */
  public override get(key: K): V | undefined {
    const value = super.get(key)
    if (value !== undefined) {
      // Update access time for LRU
      this.accessOrder.set(key, Date.now())
    }
    return value
  }

  /**
   * Set a value in the cache
   * @param key The key to set
   * @param value The value to set
   */
  public override set(key: K, value: V): this {
    // If we're at max size, remove oldest entry
    if (this.size >= this.maxSize) {
      this.removeLRU()
    }

    // Update access time
    this.accessOrder.set(key, Date.now())
    return super.set(key, value)
  }

  /**
   * Delete a value from the cache
   * @param key The key to delete
   */
  public override delete(key: K): boolean {
    this.accessOrder.delete(key)
    this.ttls.delete(key)
    return super.delete(key)
  }

  /**
   * Clear the cache
   */
  public override clear(): void {
    this.accessOrder.clear()
    this.ttls.clear()
    super.clear()
  }

  /**
   * Sweep expired entries from the cache
   * @param filter Optional filter function
   */
  public sweep(
    filter?: <K, V>(value: V, key: K, collection: Collection<K, V>) => boolean,
  ): number {
    const sweepFilter = filter ?? this.sweepFilter
    const now = Date.now()
    let count = 0

    for (const [key, value] of this.entries()) {
      const accessTime = this.accessOrder.get(key) ?? 0
      const expired = this.ttl !== null && now - accessTime > this.ttl

      if (expired || sweepFilter?.(value, key, this) === true) {
        this.delete(key)
        count++
      }
    }

    return count
  }

  /**
   * Remove the least recently used entry
   */
  private removeLRU(): void {
    let oldestKey: K | null = null
    let oldestTime = Infinity

    for (const [key, time] of this.accessOrder) {
      if (time < oldestTime) {
        oldestTime = time
        oldestKey = key
      }
    }

    if (oldestKey !== null) {
      this.delete(oldestKey)
    }
  }

  /**
   * Stop the sweep interval
   */
  public destroy(): void {
    if (this.sweepTimer !== null) {
      clearInterval(this.sweepTimer)
      this.sweepTimer = null
    }
  }

  /**
   * Set the TTL for an item
   * @param key The key to set TTL for
   * @param ttl The TTL in milliseconds
   */
  public setTTL(key: K, ttl: number): void {
    if (ttl > 0) {
      this.ttls.set(key, Date.now() + ttl)
    } else {
      this.ttls.delete(key)
    }
  }
}
