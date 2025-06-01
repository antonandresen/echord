import type { Client } from '../client/Client'
import type { RoleData, Snowflake } from '../types/structures'
import { Base } from './Base'
import type { Guild } from './Guild'

/**
 * Role tags structure
 */
interface RoleTags {
  botId?: Snowflake
  integrationId?: Snowflake
  premiumSubscriber?: boolean
  subscriptionListingId?: Snowflake
  availableForPurchase?: boolean
  guildConnections?: boolean
}

/**
 * Role edit data structure
 */
interface RoleEditData {
  name?: string
  permissions?: bigint
  color?: number
  hoist?: boolean
  icon?: string | null
  unicodeEmoji?: string | null
  mentionable?: boolean
}

/**
 * Represents a guild role
 */
export class Role extends Base {
  public readonly guild: Guild
  public readonly name: string
  public readonly color: number
  public readonly hoist: boolean
  public readonly icon?: string
  public readonly unicodeEmoji?: string
  public readonly position: number
  public readonly permissions: bigint
  public readonly managed: boolean
  public readonly mentionable: boolean
  public readonly tags?: RoleTags

  constructor(client: Client, guild: Guild, data: RoleData) {
    super(client, data.id)
    this.guild = guild
    this.name = data.name
    this.color = data.color
    this.hoist = data.hoist
    this.icon = data.icon ?? undefined
    this.unicodeEmoji = data.unicode_emoji ?? undefined
    this.position = data.position
    this.permissions = BigInt(data.permissions)
    this.managed = data.managed
    this.mentionable = data.mentionable
    this.tags = data.tags
      ? {
        botId: data.tags.bot_id,
        integrationId: data.tags.integration_id,
        premiumSubscriber: data.tags.premium_subscriber,
        subscriptionListingId: data.tags.subscription_listing_id,
        availableForPurchase: data.tags.available_for_purchase,
        guildConnections: data.tags.guild_connections,
      }
      : undefined
  }

  /**
   * The role's icon URL
   */
  public get iconURL(): string | null {
    if (this.icon === null || this.icon === undefined || this.icon === '') return null
    return `https://cdn.discordapp.com/role-icons/${this.id}/${this.icon}.webp`
  }

  /**
   * The hex color of the role
   */
  public get hexColor(): string {
    return `#${this.color.toString(16).padStart(6, '0')}`
  }

  /**
   * Whether the role is the @everyone role
   */
  public get isEveryone(): boolean {
    return this.id === this.guild.id
  }

  /**
   * Whether the role is a bot role
   */
  public get isBot(): boolean {
    return Boolean(this.tags?.botId)
  }

  /**
   * Whether the role is an integration role
   */
  public get isIntegration(): boolean {
    return Boolean(this.tags?.integrationId)
  }

  /**
   * Whether the role is a premium subscriber role
   */
  public get isPremiumSubscriber(): boolean {
    return Boolean(this.tags?.premiumSubscriber)
  }

  /**
   * Whether the role is available for purchase
   */
  public get isAvailableForPurchase(): boolean {
    return Boolean(this.tags?.availableForPurchase)
  }

  /**
   * Whether the role has guild connections
   */
  public get hasGuildConnections(): boolean {
    return Boolean(this.tags?.guildConnections)
  }

  /**
   * Check if the role has a specific permission
   * @param permission The permission to check
   */
  public hasPermission(permission: bigint): boolean {
    return (this.permissions & permission) === permission
  }

  /**
   * Compare this role's position to another role
   * @param role The role to compare with
   */
  public comparePositionTo(role: Role): number {
    return this.position - role.position
  }

  /**
   * Edit the role
   * @param data The data to edit
   */
  public async edit(data: RoleEditData): Promise<void> {
    await this.client.rest.patch(`/guilds/${this.guild.id}/roles/${this.id}`, {
      name: data.name,
      permissions: data.permissions?.toString(),
      color: data.color,
      hoist: data.hoist,
      icon: data.icon,
      unicode_emoji: data.unicodeEmoji,
      mentionable: data.mentionable,
    })
  }

  /**
   * Delete the role
   * @param options Delete options
   * @param options.reason The reason for deleting the role
   */
  public async delete(options: { reason?: string } = {}): Promise<void> {
    await this.client.rest.delete(`/guilds/${this.guild.id}/roles/${this.id}`, {
      reason: options.reason,
    })
  }
}
