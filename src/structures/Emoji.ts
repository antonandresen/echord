import type { Client } from '../client/Client'
import type { EmojiData, Snowflake } from '../types/structures'
import { Base } from './Base'
import type { Guild } from './Guild'
import type { Role } from './Role'
import type { User } from './User'

/**
 * Emoji edit data structure
 */
interface EmojiEditData {
  name?: string
  roles?: Set<Snowflake>
}

/**
 * Represents a guild emoji
 */
export class Emoji extends Base {
  public readonly guild: Guild
  public readonly name: string
  public readonly roles: Set<Snowflake>
  public readonly user?: User
  public readonly requireColons: boolean
  public readonly managed: boolean
  public readonly animated: boolean
  public readonly available: boolean

  constructor(client: Client, guild: Guild, data: EmojiData) {
    super(client, data.id)
    this.guild = guild
    this.name = data.name
    this.roles = new Set(data.roles ?? [])
    this.user = data.user ? client.users.get(data.user.id) : undefined
    this.requireColons = data.require_colons ?? true
    this.managed = data.managed ?? false
    this.animated = data.animated ?? false
    this.available = data.available ?? true
  }

  /**
   * The emoji's URL
   */
  public get url(): string {
    const format = this.animated ? 'gif' : 'png'
    return `https://cdn.discordapp.com/emojis/${this.id}.${format}`
  }

  /**
   * The emoji's identifier string
   */
  public get identifier(): string {
    return `${this.animated ? 'a:' : ''}${this.name}:${this.id}`
  }

  /**
   * Get all roles that can use this emoji
   */
  public getRoles(): Role[] {
    return Array.from(this.roles)
      .map((id) => this.guild.roles.get(id)!)
      .filter(Boolean)
  }

  /**
   * Check if a role can use this emoji
   * @param roleId The role ID to check
   */
  public canRoleUse(roleId: Snowflake): boolean {
    return this.roles.has(roleId)
  }

  /**
   * Edit the emoji
   * @param data The data to edit
   */
  public async edit(data: EmojiEditData): Promise<void> {
    await this.client.rest.patch(`/guilds/${this.guild.id}/emojis/${this.id}`, {
      name: data.name,
      roles: data.roles ? Array.from(data.roles) : undefined,
    })
  }

  /**
   * Delete the emoji
   * @param options Delete options
   */
  public async delete(options: { reason?: string } = {}): Promise<void> {
    await this.client.rest.delete(
      `/guilds/${this.guild.id}/emojis/${this.id}`,
      { reason: options.reason },
    )
  }

  /**
   * Returns the emoji as a string (for reactions)
   */
  public toString(): string {
    return this.id ? `<${this.identifier}>` : this.name
  }
}
