import { ChannelType } from '../../types/api'
import type { Client } from '../../client/Client'
import type { ChannelData, MessageData, Snowflake, UserData } from '../../types/structures'
import { BaseChannel } from './BaseChannel'
import type { Message } from '../Message'
import type { User } from '../User'

/**
 * Represents a DM channel
 */
export class DmChannel extends BaseChannel {
  public readonly recipients: Set<Snowflake>
  public readonly lastMessageId: Snowflake | null

  constructor(client: Client, data: ChannelData) {
    super(client, data)
    this.recipients = new Set(data.recipients?.map((user: UserData) => user.id) ?? [])
    this.lastMessageId = data.last_message_id ?? null
  }

  /**
   * Get the recipient of this DM
   */
  public get recipient(): User | undefined {
    const recipientId = Array.from(this.recipients)[0]
    return recipientId ? this.client.users.get(recipientId) : undefined
  }

  /**
   * Send a message in this channel
   * @param content The message content or options
   */
  public async send(
    content: string | { content?: string; embeds?: any[]; files?: any[] },
  ): Promise<Message> {
    const data =
      typeof content === 'string' ? { content } : content

    const response = await this.client.rest.post<MessageData>(
      `/channels/${this.id}/messages`,
      data,
    )

    return this.client.channels._add(response)
  }

  /**
   * Get messages in this channel
   * @param options The options for fetching messages
   */
  public async getMessages(options: {
    limit?: number
    before?: Snowflake
    after?: Snowflake
    around?: Snowflake
  } = {}): Promise<Message[]> {
    const query = new URLSearchParams()
    if (options.limit) query.set('limit', options.limit.toString())
    if (options.before) query.set('before', options.before)
    if (options.after) query.set('after', options.after)
    if (options.around) query.set('around', options.around)

    const path = `/channels/${this.id}/messages${query.toString() ? `?${query}` : ''}`
    const messages = await this.client.rest.get<MessageData[]>(path)
    return messages.map((m) => this.client.channels._add(m))
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
   * Close this DM channel
   */
  public async close(): Promise<void> {
    await this.delete()
  }
} 