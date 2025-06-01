import { ChannelType } from '../types/api'
import type { Channel } from '../structures/Channel'
import type { Snowflake } from '../types'
import { DiscordCache, type DiscordCacheOptions } from './DiscordCache'

/**
 * Cache for Channel entities
 */
export class ChannelCache extends DiscordCache<Snowflake, Channel> {
  constructor(options: DiscordCacheOptions = {}) {
    super({
      ...options,
      keepForever: options.keepForever ?? false, // Channels can be deleted, so don't keep forever by default
      maxSize: options.maxSize ?? 1000, // Large guilds can have many channels
    })
  }

  /**
   * Find a channel by name
   * @param name The name to search for
   * @param exact Whether to match the name exactly
   */
  public findByName(name: string, exact = false): Channel | undefined {
    const predicate = exact
      ? (channel: Channel) => channel.name === name
      : (channel: Channel) =>
        channel.name.toLowerCase().includes(name.toLowerCase())
    return this.findOne(predicate)
  }

  /**
   * Find all channels by name
   * @param name The name to search for
   * @param exact Whether to match the name exactly
   */
  public findAllByName(name: string, exact = false): Channel[] {
    const predicate = exact
      ? (channel: Channel) => channel.name === name
      : (channel: Channel) =>
        channel.name.toLowerCase().includes(name.toLowerCase())
    return this.findMany(predicate)
  }

  /**
   * Find all channels of a specific type
   * @param type The channel type to search for
   */
  public findByType(type: ChannelType): Channel[] {
    return this.findMany((channel) => channel.type === type)
  }

  /**
   * Find all channels in a specific guild
   * @param guildId The guild ID to search for
   */
  public findByGuild(guildId: string): Channel[] {
    return this.findMany((channel) => channel.guildId === guildId)
  }

  /**
   * Find all channels in a specific category
   * @param categoryId The category ID to search for
   */
  public findByCategory(categoryId: string): Channel[] {
    return this.findMany((channel) => channel.parentId === categoryId)
  }

  /**
   * Find all text channels
   */
  public findTextChannels(): Channel[] {
    return this.findMany((channel) => channel.type === ChannelType.GUILD_TEXT)
  }

  /**
   * Find all voice channels
   */
  public findVoiceChannels(): Channel[] {
    return this.findMany((channel) => channel.type === ChannelType.GUILD_VOICE)
  }

  /**
   * Find all category channels
   */
  public findCategories(): Channel[] {
    return this.findMany(
      (channel) => channel.type === ChannelType.GUILD_CATEGORY,
    )
  }

  /**
   * Find all announcement channels
   */
  public findAnnouncementChannels(): Channel[] {
    return this.findMany(
      (channel) => channel.type === ChannelType.GUILD_ANNOUNCEMENT,
    )
  }

  /**
   * Find all stage channels
   */
  public findStageChannels(): Channel[] {
    return this.findMany(
      (channel) => channel.type === ChannelType.GUILD_STAGE_VOICE,
    )
  }

  /**
   * Find all thread channels
   */
  public findThreads(): Channel[] {
    return this.findMany(
      (channel) =>
        channel.type === ChannelType.PUBLIC_THREAD ||
        channel.type === ChannelType.PRIVATE_THREAD ||
        channel.type === ChannelType.ANNOUNCEMENT_THREAD,
    )
  }
}
