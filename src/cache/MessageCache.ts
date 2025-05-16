import type { Message } from '../structures/Message'
import type { User } from '../structures/User'
import type { Snowflake } from '../types'
import { DiscordCache, type DiscordCacheOptions } from './DiscordCache'

/**
 * Cache for Message entities
 */
export class MessageCache extends DiscordCache<Message> {
  constructor(options: DiscordCacheOptions = {}) {
    super({
      ...options,
      keepForever: options.keepForever ?? false, // Messages can be deleted, so don't keep forever by default
      maxSize: options.maxSize ?? 200, // Default to caching last 200 messages per channel
      ttl: options.ttl ?? 3600000, // Default to 1 hour TTL
      sweepInterval: options.sweepInterval ?? 300000, // Default to sweeping every 5 minutes
    })
  }

  /**
   * Find a message by content
   * @param content The content to search for
   * @param exact Whether to match the content exactly
   */
  public findByContent(content: string, exact = false): Message | undefined {
    const predicate = exact
      ? (message: Message) => message.content === content
      : (message: Message) =>
        message.content.toLowerCase().includes(content.toLowerCase())
    return this.findOne(predicate)
  }

  /**
   * Find all messages by content
   * @param content The content to search for
   * @param exact Whether to match the content exactly
   */
  public findAllByContent(content: string, exact = false): Message[] {
    const predicate = exact
      ? (message: Message) => message.content === content
      : (message: Message) =>
        message.content.toLowerCase().includes(content.toLowerCase())
    return this.findMany(predicate)
  }

  /**
   * Find all messages by author
   * @param authorId The author ID to search for
   */
  public findByAuthor(authorId: Snowflake): Message[] {
    return this.findMany((message) => message.author.id === authorId)
  }

  /**
   * Find all messages in a channel
   * @param channelId The channel ID to search for
   */
  public findByChannel(channelId: Snowflake): Message[] {
    return this.findMany((message) => message.channelId === channelId)
  }

  /**
   * Find all messages with attachments
   */
  public findWithAttachments(): Message[] {
    return this.findMany((message) => message.attachments.length > 0)
  }

  /**
   * Find all messages with embeds
   */
  public findWithEmbeds(): Message[] {
    return this.findMany((message) => message.embeds.length > 0)
  }

  /**
   * Find all messages with mentions
   * @param userId The user ID to check for mentions
   */
  public findWithMentions(userId: Snowflake): Message[] {
    return this.findMany((message) =>
      message.mentions.some((mention: User) => mention.id === userId),
    )
  }

  /**
   * Find all pinned messages
   */
  public findPinned(): Message[] {
    return this.findMany((message) => message.pinned)
  }

  /**
   * Find all messages sent before a specific date
   * @param date The date to check against
   */
  public findBefore(date: Date): Message[] {
    return this.findMany((message) => message.createdAt < date)
  }

  /**
   * Find all messages sent after a specific date
   * @param date The date to check against
   */
  public findAfter(date: Date): Message[] {
    return this.findMany((message) => message.createdAt > date)
  }

  /**
   * Find all messages between two dates
   * @param startDate The start date
   * @param endDate The end date
   */
  public findBetween(startDate: Date, endDate: Date): Message[] {
    return this.findMany(
      (message) => message.createdAt > startDate && message.createdAt < endDate,
    )
  }
}
