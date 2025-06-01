import { BaseCache, type CacheOptions } from './BaseCache'

/**
 * Options for Discord entity caches
 */
export interface DiscordCacheOptions extends CacheOptions {
  /**
   * Whether to keep entities in memory indefinitely
   */
  keepForever?: boolean

  /**
   * Maximum number of entities to keep in memory
   * @default 1000
   */
  maxSize?: number

  /**
   * Time in milliseconds after which entities should be considered expired
   * @default 3600000 (1 hour)
   */
  ttl?: number

  /**
   * Interval in milliseconds at which to sweep expired entities
   * @default 300000 (5 minutes)
   */
  sweepInterval?: number

  /**
   * Maximum age in milliseconds for entities to be considered expired
   * @default null (no maximum age)
   */
  maxAge?: number | null
}

/**
 * Base class for Discord entity caches
 */
export class DiscordCache<K, V> extends BaseCache<K, V> {
  constructor(options: DiscordCacheOptions = {}) {
    super({
      maxSize: options.maxSize ?? Infinity,
      ttl: options.ttl ?? null,
      sweepInterval: options.sweepInterval ?? null,
    })
  }

  /**
   * Get multiple entities from the cache
   * @param keys The keys of the entities to get
   */
  public getMany(keys: K[]): V[] {
    return keys
      .map((key) => this.get(key))
      .filter((v): v is V => v !== undefined)
  }

  /**
   * Set multiple entities in the cache
   * @param entries The entries to set
   */
  public setMany(entries: [K, V][]): this {
    for (const [key, value] of entries) {
      this.set(key, value)
    }
    return this
  }

  /**
   * Delete multiple entities from the cache
   * @param keys The keys of the entities to delete
   */
  public deleteMany(keys: K[]): number {
    let count = 0
    for (const key of keys) {
      if (this.delete(key)) count++
    }
    return count
  }

  /**
   * Find an entity in the cache by a predicate
   * @param predicate The predicate to search with
   */
  public findOne(predicate: (value: V) => boolean): V | undefined {
    for (const value of this.values()) {
      if (predicate(value)) return value
    }
    return undefined
  }

  /**
   * Find all entities in the cache that match a predicate
   * @param predicate The predicate to search with
   */
  public findMany(predicate: (value: V) => boolean): V[] {
    const results: V[] = []
    for (const value of this.values()) {
      if (predicate(value)) results.push(value)
    }
    return results
  }
}
