import { ChannelType } from '../types/api'
import type { Client } from '../client/Client'
import type { Snowflake } from '../types'
import { Base } from './Base'

/**
 * Represents a Discord channel
 */
export class Channel extends Base {
  public type: ChannelType
  public guildId: Snowflake | null
  public position: number
  public name: string
  public topic: string | null
  public nsfw: boolean
  public lastMessageId: Snowflake | null
  public bitrate: number
  public userLimit: number
  public rateLimitPerUser: number
  public recipients: Snowflake[]
  public icon: string | null
  public ownerId: Snowflake | null
  public applicationId: Snowflake | null
  public parentId: Snowflake | null
  public lastPinTimestamp: Date | null
  public rtcRegion: string | null
  public videoQualityMode: number
  public messageCount: number
  public memberCount: number
  public threadMetadata: {
    archived: boolean
    autoArchiveDuration: number
    archiveTimestamp: Date
    locked: boolean
    invitable?: boolean
  } | null
  public permissions: string
  public flags: number
  public totalMessageSent: number
  public availableTags: {
    id: Snowflake
    name: string
    moderated: boolean
    emojiId: Snowflake | null
    emojiName: string | null
  }[]
  public appliedTags: Snowflake[]
  public defaultReactionEmoji: {
    emojiId: Snowflake | null
    emojiName: string | null
  } | null
  public defaultThreadRateLimitPerUser: number
  public defaultSortOrder: number | null
  public defaultForumLayout: number

  constructor(client: Client, data: any) {
    super(client, data.id)
    this.type = data.type
    this.guildId = data.guild_id
    this.position = data.position ?? 0
    this.name = data.name
    this.topic = data.topic
    this.nsfw = data.nsfw ?? false
    this.lastMessageId = data.last_message_id
    this.bitrate = data.bitrate ?? 0
    this.userLimit = data.user_limit ?? 0
    this.rateLimitPerUser = data.rate_limit_per_user ?? 0
    this.recipients = data.recipients ?? []
    this.icon = data.icon
    this.ownerId = data.owner_id
    this.applicationId = data.application_id
    this.parentId = data.parent_id
    this.lastPinTimestamp = data.last_pin_timestamp
      ? new Date(data.last_pin_timestamp)
      : null
    this.rtcRegion = data.rtc_region
    this.videoQualityMode = data.video_quality_mode ?? 1
    this.messageCount = data.message_count ?? 0
    this.memberCount = data.member_count ?? 0
    this.threadMetadata = data.thread_metadata
      ? {
          archived: data.thread_metadata.archived,
          autoArchiveDuration: data.thread_metadata.auto_archive_duration,
          archiveTimestamp: new Date(data.thread_metadata.archive_timestamp),
          locked: data.thread_metadata.locked,
          invitable: data.thread_metadata.invitable,
        }
      : null
    this.permissions = data.permissions
    this.flags = data.flags ?? 0
    this.totalMessageSent = data.total_message_sent ?? 0
    this.availableTags =
      data.available_tags?.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        moderated: tag.moderated,
        emojiId: tag.emoji_id,
        emojiName: tag.emoji_name,
      })) ?? []
    this.appliedTags = data.applied_tags ?? []
    this.defaultReactionEmoji = data.default_reaction_emoji
      ? {
          emojiId: data.default_reaction_emoji.emoji_id,
          emojiName: data.default_reaction_emoji.emoji_name,
        }
      : null
    this.defaultThreadRateLimitPerUser =
      data.default_thread_rate_limit_per_user ?? 0
    this.defaultSortOrder = data.default_sort_order
    this.defaultForumLayout = data.default_forum_layout ?? 0
  }

  /**
   * Whether this channel is a text channel
   */
  public isText(): boolean {
    return this.type === ChannelType.GUILD_TEXT
  }

  /**
   * Whether this channel is a DM channel
   */
  public isDM(): boolean {
    return this.type === ChannelType.DM
  }

  /**
   * Whether this channel is a voice channel
   */
  public isVoice(): boolean {
    return this.type === ChannelType.GUILD_VOICE
  }

  /**
   * Whether this channel is a group DM channel
   */
  public isGroupDM(): boolean {
    return this.type === ChannelType.GROUP_DM
  }

  /**
   * Whether this channel is a category channel
   */
  public isCategory(): boolean {
    return this.type === ChannelType.GUILD_CATEGORY
  }

  /**
   * Whether this channel is an announcement channel
   */
  public isAnnouncement(): boolean {
    return this.type === ChannelType.GUILD_ANNOUNCEMENT
  }

  /**
   * Whether this channel is a thread channel
   */
  public isThread(): boolean {
    return (
      this.type === ChannelType.ANNOUNCEMENT_THREAD ||
      this.type === ChannelType.PUBLIC_THREAD ||
      this.type === ChannelType.PRIVATE_THREAD
    )
  }

  /**
   * Whether this channel is a stage channel
   */
  public isStage(): boolean {
    return this.type === ChannelType.GUILD_STAGE_VOICE
  }

  /**
   * Whether this channel is a forum channel
   */
  public isForum(): boolean {
    return this.type === ChannelType.GUILD_FORUM
  }

  /**
   * Whether this channel is a media channel
   */
  public isMedia(): boolean {
    return this.type === ChannelType.GUILD_MEDIA
  }
}
