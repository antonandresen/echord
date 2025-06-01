import { BaseChannel } from '../structures/channels/BaseChannel'
import { CategoryChannel } from '../structures/channels/CategoryChannel'
import { DmChannel } from '../structures/channels/DmChannel'
import { ForumChannel } from '../structures/channels/ForumChannel'
import { MediaChannel } from '../structures/channels/MediaChannel'
import { TextChannel } from '../structures/channels/TextChannel'
import { ThreadChannel } from '../structures/channels/ThreadChannel'
import { VoiceChannel } from '../structures/channels/VoiceChannel'
import { ChannelType } from '../types/api'
import type { Client } from '../client/Client'
import type { ChannelData, Snowflake } from '../types/structures'
import { SnowflakeManager } from './SnowflakeManager'

/**
 * Manages API methods for channels and stores their cache.
 */
export class ChannelManager extends SnowflakeManager<BaseChannel> {
  constructor(client: Client) {
    super(client)
  }

  /**
   * Data that resolves to give a Channel object. This can be:
   * A Channel object
   * A Snowflake
   */
  public resolve(resolvable: BaseChannel | Snowflake): BaseChannel | null {
    if (resolvable instanceof BaseChannel) return resolvable
    if (typeof resolvable === 'string')
      return this.cache.get(resolvable) ?? null
    return null
  }

  /**
   * Fetches a channel from Discord.
   * @param id The channel's ID
   * @param options Options for fetching the channel
   * @param options.force Whether to force a fetch from Discord
   */
  public async fetch(
    id: Snowflake,
    options: { force?: boolean } = {},
  ): Promise<BaseChannel> {
    if (options.force !== true) {
      const existing = this.cache.get(id)
      if (existing) return existing
    }

    const data = await this.client.rest.get<ChannelData>(`/channels/${id}`)
    return this._add(data)
  }

  /**
   * Creates a channel from data
   * @param data The channel data
   */
  public _add(data: ChannelData): BaseChannel {
    let channel: BaseChannel

    switch (data.type) {
      case ChannelType.GUILD_TEXT:
        channel = new TextChannel(this.client, data)
        break
      case ChannelType.DM:
        channel = new DmChannel(this.client, data)
        break
      case ChannelType.GUILD_VOICE:
        channel = new VoiceChannel(this.client, data)
        break
      case ChannelType.GUILD_CATEGORY:
        channel = new CategoryChannel(this.client, data)
        break
      case ChannelType.GUILD_FORUM:
        channel = new ForumChannel(this.client, data)
        break
      case ChannelType.GUILD_MEDIA:
        channel = new MediaChannel(this.client, data)
        break
      case ChannelType.PUBLIC_THREAD:
      case ChannelType.PRIVATE_THREAD:
      case ChannelType.ANNOUNCEMENT_THREAD:
        channel = new ThreadChannel(this.client, data)
        break
      default:
        // For unknown channel types, create a TextChannel as fallback
        channel = new TextChannel(this.client, data)
        break
    }

    this.cache.set(channel.id, channel)
    return channel
  }
}
