import { Guild } from '../structures/Guild'
import type { Client } from '../client/Client'
import type { APIGuild } from '../types/api'
import type { GuildData, Snowflake } from '../types/structures'
import { SnowflakeManager } from './SnowflakeManager'

/**
 * Manages API methods for guilds and stores their cache.
 */
export class GuildManager extends SnowflakeManager<Guild> {
  constructor(client: Client) {
    super(client)
  }

  /**
   * Data that resolves to give a Guild object. This can be:
   * A Guild object
   * A Snowflake
   */
  public resolve(resolvable: Guild | Snowflake): Guild | null {
    if (resolvable instanceof Guild) return resolvable
    if (typeof resolvable === 'string')
      return this.cache.get(resolvable) ?? null
    return null
  }

  /**
   * Fetches a guild from Discord.
   * @param id The guild's ID
   * @param options Options for fetching the guild
   * @param options.force Whether to force a fetch from Discord
   */
  public async fetch(
    id: Snowflake,
    options: { force?: boolean } = {},
  ): Promise<Guild> {
    if (options.force !== true) {
      const existing = this.cache.get(id)
      if (existing) return existing
    }

    const data = await this.client.rest.get<APIGuild>(`/guilds/${id}`)
    return this._add(data)
  }

  /**
   * Creates a new guild.
   * @param options Options for creating the guild
   * @param options.name The name of the guild
   * @param options.icon The icon of the guild
   * @param options.verificationLevel The verification level of the guild
   * @param options.defaultMessageNotifications The default message notification level
   * @param options.explicitContentFilter The explicit content filter level
   * @param options.roles Array of roles to create
   * @param options.channels Array of channels to create
   * @param options.systemChannelId The system channel ID
   * @param options.systemChannelFlags The system channel flags
   * @param options.afkChannelId The AFK channel ID
   * @param options.afkTimeout The AFK timeout in seconds
   * @param options.region The voice region
   */
  public async create(options: {
    name: string
    icon?: string | null
    verificationLevel?: number
    defaultMessageNotifications?: number
    explicitContentFilter?: number
    roles?: Array<{
      name?: string
      permissions?: string
      color?: number
      hoist?: boolean
      mentionable?: boolean
    }>
    channels?: Array<{
      name: string
      type: number
      topic?: string
      bitrate?: number
      userLimit?: number
      rateLimitPerUser?: number
      position?: number
      permissionOverwrites?: Array<{
        id: Snowflake
        type: number
        allow?: string
        deny?: string
      }>
      parentId?: Snowflake
      nsfw?: boolean
    }>
    systemChannelId?: Snowflake
    systemChannelFlags?: number
    afkChannelId?: Snowflake
    afkTimeout?: number
    region?: string
  }): Promise<Guild> {
    const data = await this.client.rest.post<APIGuild>('/guilds', {
      body: {
        name: options.name,
        icon: options.icon,
        verification_level: options.verificationLevel,
        default_message_notifications: options.defaultMessageNotifications,
        explicit_content_filter: options.explicitContentFilter,
        roles: options.roles,
        channels: options.channels,
        system_channel_id: options.systemChannelId,
        system_channel_flags: options.systemChannelFlags,
        afk_channel_id: options.afkChannelId,
        afk_timeout: options.afkTimeout,
        region: options.region,
      },
    })

    return this._add(data)
  }

  /**
   * Deletes a guild.
   * @param guild The guild to delete
   */
  public async delete(guild: Guild | Snowflake): Promise<void> {
    const id = guild instanceof Guild ? guild.id : guild
    await this.client.rest.delete(`/guilds/${id}`)
    this.cache.delete(id)
  }

  protected _add(data: APIGuild, cache = true): Guild {
    const guild = new Guild(this.client, data as unknown as GuildData)
    if (cache === true) {
      this.cache.set(guild.id, guild)
    }
    return guild
  }
}
