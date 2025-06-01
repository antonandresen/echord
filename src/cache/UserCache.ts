import type { User } from '../structures/User'
import type { Snowflake } from '../types'
import { DiscordCache, type DiscordCacheOptions } from './DiscordCache'

/**
 * Cache for User entities
 */
export class UserCache extends DiscordCache<Snowflake, User> {
  constructor(options: DiscordCacheOptions = {}) {
    super({
      ...options,
      keepForever: options.keepForever ?? true, // Users are typically kept forever
      maxSize: options.maxSize ?? 1000, // Cache up to 1000 users
    })
  }

  /**
   * Find a user by username
   * @param username The username to search for
   * @param exact Whether to match the username exactly
   */
  public findByUsername(username: string, exact = false): User | undefined {
    const predicate = exact
      ? (user: User) => user.username === username
      : (user: User) =>
        user.username.toLowerCase().includes(username.toLowerCase())
    return this.findOne(predicate)
  }

  /**
   * Find all users by username
   * @param username The username to search for
   * @param exact Whether to match the username exactly
   */
  public findAllByUsername(username: string, exact = false): User[] {
    const predicate = exact
      ? (user: User) => user.username === username
      : (user: User) =>
        user.username.toLowerCase().includes(username.toLowerCase())
    return this.findMany(predicate)
  }

  /**
   * Find a user by tag (username#discriminator)
   * @param tag The tag to search for
   */
  public findByTag(tag: string): User | undefined {
    return this.findOne((user) => user.tag === tag)
  }

  /**
   * Find all users by tag (username#discriminator)
   * @param tag The tag to search for
   */
  public findAllByTag(tag: string): User[] {
    return this.findMany((user) => user.tag === tag)
  }

  /**
   * Find all bot users
   */
  public findBots(): User[] {
    return this.findMany((user) => user.bot)
  }

  /**
   * Find all system users
   */
  public findSystemUsers(): User[] {
    return this.findMany((user) => user.system)
  }

  /**
   * Find all users with MFA enabled
   */
  public findWithMFA(): User[] {
    return this.findMany((user) => user.mfaEnabled)
  }

  /**
   * Find all verified users
   */
  public findVerified(): User[] {
    return this.findMany((user) => user.verified)
  }

  /**
   * Find all users with Nitro
   */
  public findWithNitro(): User[] {
    return this.findMany((user) => user.hasNitro())
  }
}
