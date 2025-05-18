import type { Client } from '../../client/Client'
import type { ChannelData, Snowflake } from '../../types/structures'
import { TextChannel } from './TextChannel'

/**
 * Represents a thread channel
 */
export class ThreadChannel extends TextChannel {
  public readonly archived: boolean
  public readonly autoArchiveDuration: number
  public readonly archiveTimestamp: Date
  public readonly locked: boolean
  public readonly invitable: boolean | undefined
  public readonly memberCount: number
  public readonly messageCount: number
  public readonly totalMessageSent: number

  constructor(client: Client, data: ChannelData) {
    super(client, data)
    const metadata = data.thread_metadata!
    this.archived = metadata.archived
    this.autoArchiveDuration = metadata.auto_archive_duration
    this.archiveTimestamp = new Date(metadata.archive_timestamp)
    this.locked = metadata.locked
    this.invitable = metadata.invitable
    this.memberCount = data.member_count ?? 0
    this.messageCount = data.message_count ?? 0
    this.totalMessageSent = data.total_message_sent ?? 0
  }

  /**
   * Join this thread
   */
  public async join(): Promise<void> {
    await this.client.rest.put(`/channels/${this.id}/thread-members/@me`)
  }

  /**
   * Leave this thread
   */
  public async leave(): Promise<void> {
    await this.client.rest.delete(`/channels/${this.id}/thread-members/@me`)
  }

  /**
   * Add a member to this thread
   * @param userId The user ID to add
   */
  public async addMember(userId: Snowflake): Promise<void> {
    await this.client.rest.put(`/channels/${this.id}/thread-members/${userId}`)
  }

  /**
   * Remove a member from this thread
   * @param userId The user ID to remove
   */
  public async removeMember(userId: Snowflake): Promise<void> {
    await this.client.rest.delete(
      `/channels/${this.id}/thread-members/${userId}`,
    )
  }

  /**
   * Archive or unarchive this thread
   * @param archived Whether to archive or unarchive
   */
  public async setArchived(archived: boolean): Promise<this> {
    return await this.edit({ thread_metadata: { archived } })
  }

  /**
   * Lock or unlock this thread
   * @param locked Whether to lock or unlock
   */
  public async setLocked(locked: boolean): Promise<this> {
    return await this.edit({ thread_metadata: { locked } })
  }

  /**
   * Set whether this thread is invitable
   * @param invitable Whether the thread is invitable
   */
  public async setInvitable(invitable: boolean): Promise<this> {
    return await this.edit({ thread_metadata: { invitable } })
  }

  /**
   * Set the auto archive duration for this thread
   * @param duration The duration in minutes (60, 1440, 4320, 10080)
   */
  public async setAutoArchiveDuration(
    duration: 60 | 1440 | 4320 | 10080,
  ): Promise<this> {
    return await this.edit({
      thread_metadata: { auto_archive_duration: duration },
    })
  }
}
