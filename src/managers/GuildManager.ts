import { Guild } from '../structures/Guild'
import type { Client } from '../client/Client'
import type { Snowflake } from '../types'
import type { APIGuild } from '../types/api'
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
   */
  public async fetch(
    id: Snowflake,
    options: { force?: boolean } = {},
  ): Promise<Guild> {
    if (!options.force) {
      const existing = this.cache.get(id)
      if (existing) return existing
    }

    const data = await this.client.rest.get<APIGuild>(`/guilds/${id}`)
    return this._add(data)
  }

  /**
   * Creates a new guild.
   * @param options Options for creating the guild
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

  protected _add(data: APIGuild): Guild {
    const guild = new Guild(this.client, data)
    this.cache.set(guild.id, guild)
    return guild
  }
}
