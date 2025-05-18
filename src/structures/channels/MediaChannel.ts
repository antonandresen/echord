import type { Client } from '../../client/Client'
import type { ChannelData, Snowflake } from '../../types/structures'
import type { Message } from '../Message'
import { ForumChannel } from './ForumChannel'

/**
 * Represents a media channel
 */
export class MediaChannel extends ForumChannel {
  constructor(client: Client, data: ChannelData) {
    super(client, data)
  }

  /**
   * Create a media post in this channel
   * @param options The post options
   */
  public async createMediaPost(options: {
    name: string
    content?: string
    files: any[]
    tags?: Snowflake[]
  }): Promise<Message> {
    if (!options.files?.length) {
      throw new Error('Media posts must include at least one file')
    }

    return await this.createPost(options)
  }
}
