import type { Client } from '../../client/Client'
import type {
  ChannelData,
  MessageData,
  Snowflake,
  UserData,
} from '../../types/structures'
import { Message } from '../Message'
import type { User } from '../User'
import { BaseChannel } from './BaseChannel'

/**
 * Represents a DM channel
 */
export class DmChannel extends BaseChannel {
  public readonly recipients: Set<Snowflake>
  public readonly lastMessageId: Snowflake | null

  constructor(client: Client, data: ChannelData) {
    super(client, data)
    this.recipients = new Set(
      data.recipients?.map((user: UserData) => user.id) ?? [],
    )
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
   * Send a message to this channel
   * @param content The content of the message
   * @param options Additional message options
   */
  public async send(
    content: string,
    options: Record<string, unknown> = {},
  ): Promise<unknown> {
    return this.client.rest.post(`/channels/${this.id}/messages`, {
      content,
      ...options,
    })
  }

  /**
   * Fetch messages from this channel
   * @param options Fetch options
   */
  public async fetchMessages(options: {
    limit?: number
    before?: string
    after?: string
    around?: string
  } = {}): Promise<unknown[]> {
    const params = new URLSearchParams()
    if (options.limit !== null && options.limit !== undefined && options.limit !== 0) params.append('limit', options.limit.toString())
    if (options.before !== null && options.before !== undefined && options.before !== '') params.append('before', options.before)
    if (options.after !== null && options.after !== undefined && options.after !== '') params.append('after', options.after)
    if (options.around !== null && options.around !== undefined && options.around !== '') params.append('around', options.around)

    return this.client.rest.get(`/channels/${this.id}/messages?${params.toString()}`)
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
    return messages.map((m) => new Message(this.client, m))
  }

  /**
   * Get pinned messages in this channel
   */
  public async getPinnedMessages(): Promise<Message[]> {
    const messages = await this.client.rest.get<MessageData[]>(
      `/channels/${this.id}/pins`,
    )
    return messages.map((m) => new Message(this.client, m))
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
