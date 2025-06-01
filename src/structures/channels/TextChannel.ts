import type { Client } from '../../client/Client'
import type {
  ChannelData,
  MessageData,
  Snowflake,
} from '../../types/structures'
import type { Message } from '../Message'
import { BaseChannel } from './BaseChannel'

/**
 * Represents a text channel
 */
export class TextChannel extends BaseChannel {
  public lastMessageId: Snowflake | null
  public lastPinTimestamp: Date | null

  constructor(client: Client, data: ChannelData) {
    super(client, data)
    this.lastMessageId = data.last_message_id ?? null
    this.lastPinTimestamp = data.last_pin_timestamp
      ? new Date(data.last_pin_timestamp)
      : null
  }

  /**
   * Send a message in this channel
   * @param content The message content or options
   */
  public async send(
    content: string | { content?: string; embeds?: any[]; files?: any[] },
  ): Promise<Message> {
    const data = typeof content === 'string' ? { content } : content

    const response = await this.client.rest.post<MessageData>(
      `/channels/${this.id}/messages`,
      data,
    )

    return this.client.channels._add(response)
  }

  /**
   * Bulk delete messages in this channel
   * @param messages The messages to delete
   */
  public async bulkDelete(messages: Snowflake[] | number): Promise<void> {
    if (typeof messages === 'number') {
      const path = `/channels/${this.id}/messages?limit=${messages}`
      const fetchedMessages = await this.client.rest.get<MessageData[]>(path)
      messages = fetchedMessages.map((m) => m.id)
    }

    await this.client.rest.post(`/channels/${this.id}/messages/bulk-delete`, {
      messages,
    })
  }

  /**
   * Set the channel topic
   * @param topic The new topic
   */
  public async setTopic(topic: string | undefined): Promise<this> {
    return await this.edit({ topic })
  }

  /**
   * Set the channel NSFW flag
   * @param nsfw Whether the channel is NSFW
   */
  public async setNSFW(nsfw: boolean): Promise<this> {
    return await this.edit({ nsfw })
  }

  /**
   * Set the channel rate limit
   * @param rateLimit The new rate limit in seconds
   */
  public async setRateLimit(rateLimit: number): Promise<this> {
    return await this.edit({ rate_limit_per_user: rateLimit })
  }

  /**
   * Pin a message in this channel
   * @param messageId The message ID to pin
   */
  public async pinMessage(messageId: Snowflake): Promise<void> {
    await this.client.rest.put(`/channels/${this.id}/pins/${messageId}`)
  }

  /**
   * Unpin a message in this channel
   * @param messageId The message ID to unpin
   */
  public async unpinMessage(messageId: Snowflake): Promise<void> {
    await this.client.rest.delete(`/channels/${this.id}/pins/${messageId}`)
  }

  /**
   * Get pinned messages in this channel
   */
  public async getPinnedMessages(): Promise<Message[]> {
    const messages = await this.client.rest.get<MessageData[]>(
      `/channels/${this.id}/pins`,
    )
    return messages.map((m) => this.client.channels._add(m))
  }
}
