import type { Guild } from '../structures/Guild'
import type { GuildFeature } from '../types/api'
import type { Snowflake } from '../types'
import { DiscordCache, type DiscordCacheOptions } from './DiscordCache'

/**
 * Cache for Guild entities
 */
export class GuildCache extends DiscordCache<Snowflake, Guild> {
  constructor(options: DiscordCacheOptions = {}) {
    super({
      ...options,
      keepForever: options.keepForever ?? true, // Guilds are typically kept forever
      maxSize: options.maxSize ?? 100, // Most bots are in fewer than 100 guilds
    })
  }

  /**
   * Find a guild by name
   * @param name The name to search for
   * @param exact Whether to match the name exactly
   */
  public findByName(name: string, exact = false): Guild | undefined {
    const predicate = exact
      ? (guild: Guild) => guild.name === name
      : (guild: Guild) => guild.name.toLowerCase().includes(name.toLowerCase())
    return this.findOne(predicate)
  }

  /**
   * Find all guilds by name
   * @param name The name to search for
   * @param exact Whether to match the name exactly
   */
  public findAllByName(name: string, exact = false): Guild[] {
    const predicate = exact
      ? (guild: Guild) => guild.name === name
      : (guild: Guild) => guild.name.toLowerCase().includes(name.toLowerCase())
    return this.findMany(predicate)
  }

  /**
   * Find a guild by region
   * @param region The region to search for
   */
  public findByRegion(region: string): Guild[] {
    return this.findMany((guild) => guild.region === region)
  }

  /**
   * Find all guilds with a specific feature
   * @param feature The feature to search for
   */
  public findByFeature(feature: GuildFeature): Guild[] {
    return this.findMany((guild) => guild.features.includes(feature))
  }

  /**
   * Find all guilds where the bot has a specific permission
   * @param permission The permission to check for
   */
  public findByPermission(permission: bigint): Guild[] {
    return this.findMany((guild) => {
      if (guild.permissions === undefined) return false
      const perms = typeof guild.permissions === 'string' ? BigInt(guild.permissions) : guild.permissions
      return (perms & permission) === permission
    })
  }
}
