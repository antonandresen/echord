import type { Client } from '../../client/Client'
import type {
  ChannelData,
  MessageData,
  Snowflake,
} from '../../types/structures'
import type { Message } from '../Message'
import { TextChannel } from './TextChannel'

/**
 * Represents an announcement channel
 */
export class AnnouncementChannel extends TextChannel {
  constructor(client: Client, data: ChannelData) {
    super(client, data)
  }

  /**
   * Follow this announcement channel
   * @param webhookChannelId The channel ID to crosspost messages to
   */
  public async follow(webhookChannelId: Snowflake): Promise<void> {
    await this.client.rest.post(`/channels/${this.id}/followers`, {
      webhook_channel_id: webhookChannelId,
    })
  }

  /**
   * Crosspost a message in this channel
   * @param messageId The message ID to crosspost
   */
  public async crosspostMessage(messageId: Snowflake): Promise<Message> {
    const response = await this.client.rest.post<MessageData>(
      `/channels/${this.id}/messages/${messageId}/crosspost`,
    )
    return this.client.channels._add(response)
  }

  /**
   * Send a message and automatically crosspost it
   * @param content The message content or options
   */
  public async sendAndCrosspost(
    content: string | { content?: string; embeds?: any[]; files?: any[] },
  ): Promise<Message> {
    const message = await this.send(content)
    return this.crosspostMessage(message.id)
  }
}
