import type { Client } from '../../client/Client'
import type {
  ChannelData,
  MessageData,
  Snowflake,
} from '../../types/structures'
import { Message } from '../Message'
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
    this.lastPinTimestamp = data.last_pin_timestamp !== null && data.last_pin_timestamp !== undefined
      ? new Date(data.last_pin_timestamp)
      : null
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

  /**
   * Bulk delete messages in this channel
   * @param messages The messages to delete
   */
  public async bulkDelete(messages: Snowflake[] | number): Promise<void> {
    if (typeof messages === 'number') {
      const path = `/channels/${this.id}/messages?limit=${messages}`
      const fetchedMessages = await this.client.rest.get<MessageData[]>(path)
      messages = fetchedMessages.map((m: MessageData) => m.id)
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
   * Get messages in this channel
   * @param options The options for fetching messages
   * @param options.limit The maximum number of messages to fetch
   * @param options.before Get messages before this message ID
   * @param options.after Get messages after this message ID
   * @param options.around Get messages around this message ID
   */
  public async getMessages(
    options: {
      limit?: number
      before?: Snowflake
      after?: Snowflake
      around?: Snowflake
    } = {},
  ): Promise<Message[]> {
    const query = new URLSearchParams()
    if (options.limit !== null && options.limit !== undefined && options.limit !== 0) query.set('limit', options.limit.toString())
    if (options.before !== null && options.before !== undefined && options.before !== '') query.set('before', options.before)
    if (options.after !== null && options.after !== undefined && options.after !== '') query.set('after', options.after)
    if (options.around !== null && options.around !== undefined && options.around !== '') query.set('around', options.around)

    const path = `/channels/${this.id}/messages${query.toString() ? `?${query.toString()}` : ''}`
    const messages = await this.client.rest.get<MessageData[]>(path)
    return messages.map((m: MessageData) => new Message(this.client, m))
  }

  /**
   * Get pinned messages in this channel
   */
  public async getPinnedMessages(): Promise<Message[]> {
    const messages = await this.client.rest.get<MessageData[]>(
      `/channels/${this.id}/pins`,
    )
    return messages.map((m: MessageData) => new Message(this.client, m))
  }
}
