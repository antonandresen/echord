import type { Client } from '../client/Client'
import type {
  AvatarURLOptions,
  MemberData,
  Snowflake,
} from '../types/structures'
import { Base, type Guild, type Role, type User } from '.'

/**
 * Represents a guild member
 */
export class Member extends Base {
  public readonly guild: Guild
  public readonly user: User
  public readonly roles: Set<Snowflake>
  public readonly joinedAt: Date
  public readonly premiumSince?: Date
  public readonly deaf: boolean
  public readonly mute: boolean
  public readonly pending: boolean
  public communicationDisabledUntil?: Date
  public nick?: string
  public avatar?: string

  constructor(client: Client, guild: Guild, data: MemberData) {
    super(client, data.user.id)
    this.guild = guild
    this.user = client.users.get(data.user.id)!
    this.roles = new Set(data.roles)
    this.joinedAt = new Date(data.joined_at)
    this.premiumSince = data.premium_since
      ? new Date(data.premium_since)
      : undefined
    this.deaf = data.deaf ?? false
    this.mute = data.mute ?? false
    this.pending = data.pending ?? false
    this.communicationDisabledUntil = data.communication_disabled_until
      ? new Date(data.communication_disabled_until)
      : undefined
    this.nick = data.nick
    this.avatar = data.avatar
  }

  /**
   * The member's display name
   */
  public get displayName(): string {
    return this.nick ?? this.user.username
  }

  /**
   * The member's display avatar URL
   * @param options Avatar options
   */
  public displayAvatarURL(options: AvatarURLOptions = {}): string {
    if (this.avatar) {
      const format = options.format ?? 'webp'
      const size = options.size ?? 1024
      return `https://cdn.discordapp.com/guilds/${this.guild.id}/users/${this.id}/avatars/${this.avatar}.${format}?size=${size}`
    }
    return this.user.displayAvatarURL(options)
  }

  /**
   * Whether the member is timed out
   */
  public get isTimedOut(): boolean {
    return Boolean(
      this.communicationDisabledUntil &&
      this.communicationDisabledUntil.getTime() > Date.now(),
    )
  }

  /**
   * Get all roles of the member
   */
  public getRoles(): Role[] {
    return Array.from(this.roles)
      .map((id) => this.guild.roles.get(id))
      .filter((role): role is Role => role !== undefined)
  }

  /**
   * Check if the member has a specific role
   * @param roleId The role ID to check
   */
  public hasRole(roleId: Snowflake): boolean {
    return this.roles.has(roleId)
  }

  /**
   * Check if the member has a specific permission
   * @param permission The permission to check
   */
  public hasPermission(permission: bigint): boolean {
    // Get all roles including @everyone
    const roles = [...this.getRoles(), this.guild.roles.get(this.guild.id)!]
    // Check if any role has the permission
    return roles.some((role) => (role.permissions & permission) === permission)
  }

  /**
   * Check if the member is the guild owner
   */
  public isOwner(): boolean {
    return this.guild.ownerId === this.id
  }

  /**
   * Check if the member can manage the given role
   * @param role The role to check
   */
  public canManageRole(role: Role): boolean {
    if (this.isOwner()) return true
    const highestRole = this.getRoles().reduce((prev, curr) =>
      prev.position > curr.position ? prev : curr,
    )
    return highestRole.position > role.position
  }

  /**
   * Add a role to the member
   * @param roleId The role ID to add
   */
  public async addRole(roleId: Snowflake): Promise<void> {
    await this.client.rest.put(
      `/guilds/${this.guild.id}/members/${this.id}/roles/${roleId}`,
    )
    this.roles.add(roleId)
  }

  /**
   * Remove a role from the member
   * @param roleId The role ID to remove
   */
  public async removeRole(roleId: Snowflake): Promise<void> {
    await this.client.rest.delete(
      `/guilds/${this.guild.id}/members/${this.id}/roles/${roleId}`,
    )
    this.roles.delete(roleId)
  }

  /**
   * Set the member's nickname
   * @param nick The new nickname
   */
  public async setNickname(nick: string | null): Promise<void> {
    await this.client.rest.patch(
      `/guilds/${this.guild.id}/members/${this.id}`,
      { nick },
    )
    this.nick = nick ?? undefined
  }

  /**
   * Timeout the member
   * @param duration Duration in milliseconds
   */
  public async timeout(duration: number): Promise<void> {
    const communicationDisabledUntil = new Date(Date.now() + duration)
    await this.client.rest.patch(
      `/guilds/${this.guild.id}/members/${this.id}`,
      {
        communication_disabled_until: communicationDisabledUntil.toISOString(),
      },
    )
    this.communicationDisabledUntil = communicationDisabledUntil
  }

  /**
   * Remove the member's timeout
   */
  public async removeTimeout(): Promise<void> {
    await this.client.rest.patch(
      `/guilds/${this.guild.id}/members/${this.id}`,
      {
        communication_disabled_until: null,
      },
    )
    this.communicationDisabledUntil = undefined
  }

  /**
   * Kick the member from the guild
   * @param options Kick options
   */
  public async kick(options: { reason?: string } = {}): Promise<void> {
    await this.client.rest.delete(
      `/guilds/${this.guild.id}/members/${this.id}`,
      { reason: options.reason },
    )
  }

  /**
   * Ban the member from the guild
   * @param options Ban options
   */
  public async ban(
    options: { days?: number; reason?: string } = {},
  ): Promise<void> {
    await this.client.rest.put(`/guilds/${this.guild.id}/bans/${this.id}`, {
      delete_message_days: options.days ?? 0,
      reason: options.reason,
    })
  }
}
