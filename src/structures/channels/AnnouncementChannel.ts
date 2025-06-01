import type { Client } from '../../client/Client'
import type {
  ChannelData,
  MessageData,
  Snowflake,
} from '../../types/structures'
import { Message } from '../Message'
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
    return new Message(this.client, response)
  }

  /**
   * Send a message and automatically crosspost it
   * @param content The message content
   * @param options Additional message options
   */
  public async sendAndCrosspost(
    content: string,
    options: Record<string, unknown> = {},
  ): Promise<Message> {
    const message = await this.send(content, options)
    return this.crosspostMessage(message.id)
  }

  /**
   * Send a message to this channel
   * @param content The content of the message
   * @param options Additional message options
   */
  public async send(
    content: string,
    options: Record<string, unknown> = {},
  ): Promise<Message> {
    const response = await this.client.rest.post<MessageData>(
      `/channels/${this.id}/messages`,
      {
        content,
        ...options,
      },
    )
    return new Message(this.client, response)
  }
}
