import type { Client } from '../client/Client'
import type { Channel } from '../structures/Channel'
import type { Guild } from '../structures/Guild'
import type { Message } from '../structures/Message'
import type { User } from '../structures/User'
import { ChannelCache } from './ChannelCache'
import { GuildCache } from './GuildCache'
import { MessageCache } from './MessageCache'
import { UserCache } from './UserCache'
import type { DiscordCacheOptions } from './DiscordCache'

/**
 * Manages all caches for the client
 */
export class CacheManager {
  private readonly client: Client
  private readonly options: DiscordCacheOptions

  public readonly guilds: GuildCache
  public readonly channels: ChannelCache
  public readonly messages: MessageCache
  public readonly users: UserCache

  constructor(client: Client, options: DiscordCacheOptions = {}) {
    this.client = client
    this.options = options

    // Initialize caches with their specific options
    this.guilds = new GuildCache({
      ...options,
      keepForever: options.keepForever ?? true, // Guilds are typically kept forever
      maxSize: options.maxSize ?? 100, // Most bots are in fewer than 100 guilds
    })

    this.channels = new ChannelCache({
      ...options,
      keepForever: options.keepForever ?? false, // Channels can be deleted
      maxSize: options.maxSize ?? 1000, // Large guilds can have many channels
    })

    this.messages = new MessageCache({
      ...options,
      keepForever: options.keepForever ?? false, // Messages can be deleted
      maxSize: options.maxSize ?? 200, // Default to caching last 200 messages per channel
      ttl: options.ttl ?? 3600000, // Default to 1 hour TTL
      sweepInterval: options.sweepInterval ?? 300000, // Default to sweeping every 5 minutes
    })

    this.users = new UserCache({
      ...options,
      keepForever: options.keepForever ?? true, // Users are typically kept forever
      maxSize: options.maxSize ?? 1000, // Cache up to 1000 users
    })
  }

  /**
   * Get a guild from the cache
   * @param id The guild ID
   */
  public getGuild(id: string): Guild | undefined {
    return this.guilds.get(id)
  }

  /**
   * Get a channel from the cache
   * @param id The channel ID
   */
  public getChannel(id: string): Channel | undefined {
    return this.channels.get(id)
  }

  /**
   * Get a message from the cache
   * @param id The message ID
   */
  public getMessage(id: string): Message | undefined {
    return this.messages.get(id)
  }

  /**
   * Get a user from the cache
   * @param id The user ID
   */
  public getUser(id: string): User | undefined {
    return this.users.get(id)
  }

  /**
   * Clear all caches
   */
  public clear(): void {
    this.guilds.clear()
    this.channels.clear()
    this.messages.clear()
    this.users.clear()
  }

  /**
   * Sweep all caches
   */
  public sweep(): void {
    this.guilds.sweep()
    this.channels.sweep()
    this.messages.sweep()
    this.users.sweep()
  }

  /**
   * Destroy all caches
   */
  public destroy(): void {
    this.guilds.destroy()
    this.channels.destroy()
    this.messages.destroy()
    this.users.destroy()
  }
}
