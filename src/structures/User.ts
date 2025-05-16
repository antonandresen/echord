import type { Client } from '../client/Client'
import type { AvatarURLOptions, UserData } from '../types/structures'
import { Base } from './Base'

/**
 * Represents a Discord user
 */
export class User extends Base {
  public username: string
  public discriminator: string
  public avatar: string | null
  public bot: boolean
  public system: boolean
  public mfaEnabled: boolean
  public banner: string | null
  public accentColor: number | null
  public locale: string | null
  public verified: boolean
  public email: string | null
  public flags: number
  public premiumType: number
  public publicFlags: number
  public avatarDecoration: string | null

  constructor(client: Client, data: UserData) {
    super(client, data.id)
    this.username = data.username
    this.discriminator = data.discriminator
    this.avatar = data.avatar ?? null
    this.bot = Boolean(data.bot)
    this.system = Boolean(data.system)
    this.mfaEnabled = Boolean(data.mfa_enabled)
    this.banner = data.banner ?? null
    this.accentColor = data.accent_color ?? null
    this.locale = data.locale ?? null
    this.verified = Boolean(data.verified)
    this.email = data.email ?? null
    this.flags = data.flags ?? 0
    this.premiumType = data.premium_type ?? 0
    this.publicFlags = data.public_flags ?? 0
    this.avatarDecoration = data.avatar_decoration ?? null
  }

  /**
   * The user's tag (username#discriminator)
   */
  public get tag(): string {
    return `${this.username}#${this.discriminator}`
  }

  /**
   * The URL to the user's avatar
   * @param options Options for the avatar URL
   */
  public avatarURL(options: AvatarURLOptions = {}): string | null {
    if (!this.avatar) return null
    const format =
      options.format ?? (this.avatar.startsWith('a_') ? 'gif' : 'webp')
    const size = options.size ?? 1024
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${format}?size=${size}`
  }

  /**
   * The URL to the user's banner
   * @param options Options for the banner URL
   */
  public bannerURL(options: AvatarURLOptions = {}): string | null {
    if (!this.banner) return null
    const format =
      options.format ?? (this.banner.startsWith('a_') ? 'gif' : 'webp')
    const size = options.size ?? 1024
    return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${format}?size=${size}`
  }

  /**
   * The URL to the user's avatar decoration
   */
  public avatarDecorationURL(): string | null {
    if (!this.avatarDecoration) return null
    return `https://cdn.discordapp.com/avatar-decorations/${this.id}/${this.avatarDecoration}.png`
  }

  /**
   * The URL to the user's default avatar
   */
  public defaultAvatarURL(): string {
    const index = Number.parseInt(this.discriminator) % 5
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`
  }

  /**
   * The URL to the user's display avatar (avatar or default avatar)
   */
  public displayAvatarURL(options: AvatarURLOptions = {}): string {
    return this.avatarURL(options) ?? this.defaultAvatarURL()
  }

  /**
   * Whether this user is a bot
   */
  public isBot(): boolean {
    return this.bot
  }

  /**
   * Whether this user is a system user
   */
  public isSystem(): boolean {
    return this.system
  }

  /**
   * Whether this user has MFA enabled
   */
  public hasMFA(): boolean {
    return this.mfaEnabled
  }

  /**
   * Whether this user is verified
   */
  public isVerified(): boolean {
    return this.verified
  }

  /**
   * Whether this user has Nitro
   */
  public hasNitro(): boolean {
    return this.premiumType !== 0
  }
}
