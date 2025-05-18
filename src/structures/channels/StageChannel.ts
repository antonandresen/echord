import type { Client } from '../../client/Client'
import type { ChannelData, Snowflake } from '../../types/structures'
import { VoiceChannel } from './VoiceChannel'

/**
 * Represents a stage channel
 */
export class StageChannel extends VoiceChannel {
  constructor(client: Client, data: ChannelData) {
    super(client, data)
  }

  /**
   * Create a stage instance
   * @param topic The topic of the stage instance
   */
  public async createStageInstance(topic: string): Promise<void> {
    await this.client.rest.post('/stage-instances', {
      channel_id: this.id,
      topic,
    })
  }

  /**
   * Get the stage instance in this channel
   */
  public async getStageInstance(): Promise<any> {
    return await this.client.rest.get(`/stage-instances/${this.id}`)
  }

  /**
   * Edit the stage instance
   * @param topic The new topic
   */
  public async editStageInstance(topic: string): Promise<void> {
    await this.client.rest.patch(`/stage-instances/${this.id}`, {
      topic,
    })
  }

  /**
   * Delete the stage instance
   */
  public async deleteStageInstance(): Promise<void> {
    await this.client.rest.delete(`/stage-instances/${this.id}`)
  }

  /**
   * Request to speak in the stage
   */
  public async requestToSpeak(): Promise<void> {
    await this.client.rest.patch(`/guilds/${this.guildId}/voice-states/@me`, {
      channel_id: this.id,
      request_to_speak_timestamp: new Date().toISOString(),
    })
  }

  /**
   * Suppress or unsuppress a user in the stage
   * @param userId The user ID to modify
   * @param suppressed Whether to suppress or unsuppress
   */
  public async setSuppressed(
    userId: Snowflake,
    suppressed: boolean,
  ): Promise<void> {
    await this.client.rest.patch(
      `/guilds/${this.guildId}/voice-states/${userId}`,
      {
        channel_id: this.id,
        suppress: suppressed,
      },
    )
  }

  /**
   * Move a user to the audience
   * @param userId The user ID to move
   */
  public async moveToAudience(userId: Snowflake): Promise<void> {
    await this.setSuppressed(userId, true)
  }

  /**
   * Invite a user to speak
   * @param userId The user ID to invite
   */
  public async inviteToSpeak(userId: Snowflake): Promise<void> {
    await this.setSuppressed(userId, false)
  }
}
