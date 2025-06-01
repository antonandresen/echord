import { User } from '../structures/User'
import type { Client } from '../client/Client'
import type { Snowflake, UserData } from '../types/structures'
import { SnowflakeManager } from './SnowflakeManager'

/**
 * Manages API methods for users and stores their cache.
 */
export class UserManager extends SnowflakeManager<User> {
  constructor(client: Client) {
    super(client)
  }

  /**
   * Data that resolves to give a User object. This can be:
   * A User object
   * A Snowflake
   */
  public resolve(resolvable: User | Snowflake): User | null {
    if (resolvable instanceof User) return resolvable
    if (typeof resolvable === 'string')
      return this.cache.get(resolvable) ?? null
    return null
  }

  /**
   * Get a user from the cache
   * @param id The user's ID
   */
  public get(id: Snowflake): User | undefined {
    return this.cache.get(id)
  }

  /**
   * Fetches a user from Discord.
   * @param id The user's ID
   * @param options Options for fetching the user
   * @param options.force Whether to force a fetch from Discord
   */
  public async fetch(
    id: Snowflake,
    options: { force?: boolean } = {},
  ): Promise<User> {
    if (options.force !== true) {
      const existing = this.cache.get(id)
      if (existing) return existing
    }

    const data = await this.client.rest.get<UserData>(`/users/${id}`)
    return this._add(data)
  }

  /**
   * Creates a user from data
   * @param data The user data
   */
  protected _add(data: UserData, cache = true): User {
    const user = new User(this.client, data)
    if (cache === true) {
      this.cache.set(user.id, user)
    }
    return user
  }
}
