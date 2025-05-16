import type { Client } from '../client/Client'
import type { Base } from '../structures/Base'
import type { Snowflake } from '../types'

/**
 * The base manager for all managers that handle snowflake IDs.
 */
export abstract class SnowflakeManager<T extends Base> {
  /**
   * The client that instantiated this manager.
   */
  protected readonly client: Client

  /**
   * The cache for this manager.
   */
  public readonly cache: Map<Snowflake, T>

  constructor(client: Client) {
    this.client = client
    this.cache = new Map()
  }

  /**
   * The number of items in this manager's cache.
   */
  public get size(): number {
    return this.cache.size
  }

  /**
   * Whether this manager's cache is empty.
   */
  public get isEmpty(): boolean {
    return this.size === 0
  }

  /**
   * Resolves a data object to a structure.
   * @param resolvable The data object to resolve
   */
  public abstract resolve(resolvable: T | Snowflake): T | null

  /**
   * Clears this manager's cache.
   */
  public clear(): void {
    this.cache.clear()
  }
}
