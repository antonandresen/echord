import { ChannelType } from '../../types/api'
import type { Client } from '../../client/Client'
import type { ChannelData } from '../../types/structures'
import { BaseChannel } from './BaseChannel'

/**
 * Represents a category channel
 */
export class CategoryChannel extends BaseChannel {
  constructor(client: Client, data: ChannelData) {
    super(client, data)
  }

  /**
   * Get all channels in this category
   */
  public getChildren(): BaseChannel[] {
    return this.client.channels
      .findMany((channel: BaseChannel) => channel.parentId === this.id)
      .sort((a: BaseChannel, b: BaseChannel) => a.position - b.position)
  }

  /**
   * Create a text channel in this category
   * @param name The name of the channel
   * @param options The options for the channel
   */
  public async createTextChannel(
    name: string,
    options: Partial<ChannelData> = {},
  ): Promise<BaseChannel> {
    const response = await this.client.rest.post<ChannelData>(
      `/guilds/${this.guildId}/channels`,
      {
        ...options,
        name,
        type: ChannelType.GUILD_TEXT,
        parent_id: this.id,
      },
    )
    return this.client.channels._add(response)
  }

  /**
   * Create a voice channel in this category
   * @param name The name of the channel
   * @param options The options for the channel
   */
  public async createVoiceChannel(
    name: string,
    options: Partial<ChannelData> = {},
  ): Promise<BaseChannel> {
    const response = await this.client.rest.post<ChannelData>(
      `/guilds/${this.guildId}/channels`,
      {
        ...options,
        name,
        type: ChannelType.GUILD_VOICE,
        parent_id: this.id,
      },
    )
    return this.client.channels._add(response)
  }
}
