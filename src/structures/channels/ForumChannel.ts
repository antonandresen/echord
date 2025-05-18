import type { Client } from '../../client/Client'
import type {
  ChannelData,
  MessageData,
  Snowflake,
} from '../../types/structures'
import type { Message } from '../Message'
import { BaseChannel } from './BaseChannel'

/**
 * Represents a forum channel
 */
export class ForumChannel extends BaseChannel {
  public readonly availableTags: ForumTag[]
  public readonly defaultReactionEmoji: string | undefined
  public readonly defaultThreadRateLimitPerUser: number
  public readonly defaultSortOrder: number | undefined
  public readonly defaultForumLayout: number

  constructor(client: Client, data: ChannelData) {
    super(client, data)
    this.availableTags =
      data.available_tags?.map((tag) => ({
        id: tag.id,
        name: tag.name,
        moderated: tag.moderated,
        emojiId: tag.emoji_id,
        emojiName: tag.emoji_name,
      })) ?? []
    this.defaultReactionEmoji =
      data.default_reaction_emoji?.emoji_id ??
      data.default_reaction_emoji?.emoji_name
    this.defaultThreadRateLimitPerUser =
      data.default_thread_rate_limit_per_user ?? 0
    this.defaultSortOrder = data.default_sort_order
    this.defaultForumLayout = data.default_forum_layout ?? 0
  }

  /**
   * Create a post in this forum
   * @param options The post options
   */
  public async createPost(options: {
    name: string
    content?: string
    embeds?: any[]
    files?: any[]
    tags?: Snowflake[]
  }): Promise<Message> {
    const { name, content, embeds, files, tags } = options

    const response = await this.client.rest.post<MessageData>(
      `/channels/${this.id}/threads`,
      {
        name,
        content,
        embeds,
        files,
        applied_tags: tags,
        message: {
          content: content ?? '',
          embeds: embeds ?? [],
          files: files ?? [],
        },
      },
    )

    return this.client.channels._add(response)
  }

  /**
   * Set the available tags for this forum
   * @param tags The new tags
   */
  public async setAvailableTags(tags: Omit<ForumTag, 'id'>[]): Promise<this> {
    return await this.edit({
      available_tags: tags.map((tag) => ({
        id: '0', // Placeholder ID that will be replaced by Discord
        name: tag.name,
        moderated: tag.moderated,
        emoji_id: tag.emojiId,
        emoji_name: tag.emojiName,
      })),
    })
  }

  /**
   * Set the default reaction emoji for this forum
   * @param emoji The new emoji
   */
  public async setDefaultReactionEmoji(
    emoji: { id?: Snowflake; name?: string } | undefined,
  ): Promise<this> {
    return await this.edit({
      default_reaction_emoji: emoji
        ? {
          emoji_id: emoji.id,
          emoji_name: emoji.name,
        }
        : undefined,
    })
  }

  /**
   * Set the default thread rate limit per user for this forum
   * @param limit The new rate limit in seconds
   */
  public async setDefaultThreadRateLimit(limit: number): Promise<this> {
    return await this.edit({ default_thread_rate_limit_per_user: limit })
  }

  /**
   * Set the default sort order for this forum
   * @param order The new sort order
   */
  public async setDefaultSortOrder(order: number | undefined): Promise<this> {
    return await this.edit({ default_sort_order: order })
  }

  /**
   * Set the default forum layout
   * @param layout The new layout
   */
  public async setDefaultForumLayout(layout: number): Promise<this> {
    return await this.edit({ default_forum_layout: layout })
  }
}

interface ForumTag {
  id: Snowflake
  name: string
  moderated: boolean
  emojiId: Snowflake | undefined
  emojiName: string | undefined
}
