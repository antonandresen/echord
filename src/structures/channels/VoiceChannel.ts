import type { Client } from '../../client/Client'
import type { ChannelData, Snowflake } from '../../types/structures'
import { BaseChannel } from './BaseChannel'

/**
 * Represents a voice channel
 */
export class VoiceChannel extends BaseChannel {
  public readonly bitrate: number
  public readonly userLimit: number
  public readonly rtcRegion: string | undefined
  public readonly videoQualityMode: number

  constructor(client: Client, data: ChannelData) {
    super(client, data)
    this.bitrate = data.bitrate ?? 64000
    this.userLimit = data.user_limit ?? 0
    this.rtcRegion = data.rtc_region ?? undefined
    this.videoQualityMode = data.video_quality_mode ?? 1
  }

  /**
   * Set the channel's bitrate
   * @param bitrate The new bitrate
   */
  public async setBitrate(bitrate: number): Promise<this> {
    return await this.edit({ bitrate })
  }

  /**
   * Set the channel's user limit
   * @param limit The new user limit
   */
  public async setUserLimit(limit: number): Promise<this> {
    return await this.edit({ user_limit: limit })
  }

  /**
   * Set the channel's RTC region
   * @param region The new region
   */
  public async setRTCRegion(region: string | undefined): Promise<this> {
    return await this.edit({ rtc_region: region })
  }

  /**
   * Set the channel's video quality mode
   * @param mode The new video quality mode
   */
  public async setVideoQualityMode(mode: number): Promise<this> {
    return await this.edit({ video_quality_mode: mode })
  }

  /**
   * Join this voice channel
   */
  public async join(): Promise<void> {
    await this.client.rest.patch(`/guilds/${this.guildId}/voice-states/@me`, {
      channel_id: this.id,
    })
  }

  /**
   * Leave this voice channel
   */
  public async leave(): Promise<void> {
    await this.client.rest.patch(`/guilds/${this.guildId}/voice-states/@me`, {
      channel_id: null,
    })
  }

  /**
   * Move a member to this voice channel
   * @param userId The user ID to move
   */
  public async moveMember(userId: Snowflake): Promise<void> {
    await this.client.rest.patch(
      `/guilds/${this.guildId}/voice-states/${userId}`,
      {
        channel_id: this.id,
      },
    )
  }
}
