import { Collection } from '../util/Collection'
import type { Client } from '../client/Client'
import type { Snowflake } from '../types'

/**
 * Base class for all managers
 */
export abstract class BaseManager<K, Holds> {
  /**
   * The client that instantiated this manager
   */
  protected client: Client

  /**
   * The cache of items this manager holds
   */
  protected cache: Collection<K, Holds>

  constructor(client: Client) {
    this.client = client
    this.cache = new Collection()
  }

  /**
   * Resolves a data entry to a data Object
   */
  protected abstract resolve(data: unknown): Holds

  /**
   * Resolves a data entry to a key
   */
  protected abstract resolveKey(data: unknown): K

  /**
   * Adds an entry to the cache
   */
  protected add(data: unknown, cache = true, id?: K): Holds {
    const existing = id ? this.cache.get(id) : null
    if (existing) return existing

    const entry = this.resolve(data)
    if (cache) {
      const key = id ?? this.resolveKey(data)
      this.cache.set(key, entry)
    }

    return entry
  }

  /**
   * Removes an entry from the cache
   */
  protected remove(key: K): void {
    this.cache.delete(key)
  }

  /**
   * Clears the cache
   */
  public clear(): void {
    this.cache.clear()
  }
}

/**
 * Base class for managers that handle snowflake IDs
 */
export abstract class SnowflakeManager<Holds> extends BaseManager<
  Snowflake,
  Holds
> {
  protected resolveKey(data: { id: Snowflake }): Snowflake {
    return data.id
  }
}
