import { ChannelType } from '../../types/api'
import { Base } from '../Base'
import type { Client } from '../../client/Client'
import type { ChannelData, Snowflake } from '../../types/structures'

/**
 * Base class for all channel types
 */
export abstract class BaseChannel extends Base {
  public readonly type: ChannelType
  public readonly guildId: Snowflake | null
  public position: number
  public name: string
  public topic: string | null
  public nsfw: boolean
  public parentId: Snowflake | null
  public rateLimitPerUser: number
  public permissions: string
  public flags: number

  constructor(client: Client, data: ChannelData) {
    super(client, data.id)
    this.type = data.type as ChannelType
    this.guildId = data.guild_id ?? null
    this.position = data.position ?? 0
    this.name = data.name ?? ''
    this.topic = data.topic ?? null
    this.nsfw = data.nsfw ?? false
    this.parentId = data.parent_id ?? null
    this.rateLimitPerUser = data.rate_limit_per_user ?? 0
    this.permissions = data.permissions ?? '0'
    this.flags = data.flags ?? 0
  }

  /**
   * Delete this channel
   */
  public async delete(): Promise<void> {
    await this.client.rest.delete(`/channels/${this.id}`)
  }

  /**
   * Edit this channel
   * @param data The data to edit
   */
  public async edit(data: Partial<ChannelData>): Promise<this> {
    const response = await this.client.rest.patch(`/channels/${this.id}`, data)
    return this.client.channels._add(response) as this
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
