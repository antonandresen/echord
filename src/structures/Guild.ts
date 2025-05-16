import type { Client } from '../client/Client'
import type { EmojiData, GuildData, Snowflake } from '../types/structures'
import { Base } from './Base'
import { Emoji } from './Emoji'
import { Role } from './Role'

export class Guild extends Base {
  public name!: string
  public icon!: string | null
  public splash!: string | null
  public discoverySplash!: string | null
  public ownerId!: Snowflake
  public region!: string
  public afkChannelId!: Snowflake | null
  public afkTimeout!: number
  public verificationLevel!: number
  public defaultMessageNotifications!: number
  public explicitContentFilter!: number
  public roles!: Map<Snowflake, Role>
  public emojis!: Map<Snowflake, Emoji>
  public features!: string[]
  public mfaLevel!: number
  public systemChannelId!: Snowflake | null
  public systemChannelFlags!: number
  public rulesChannelId!: Snowflake | null
  public maxPresences!: number | null
  public maxMembers!: number
  public vanityUrlCode!: string | null
  public description!: string | null
  public banner!: string | null
  public premiumTier!: number
  public premiumSubscriptionCount!: number
  public preferredLocale!: string
  public publicUpdatesChannelId!: Snowflake | null
  public maxVideoChannelUsers!: number
  public approximateMemberCount?: number
  public approximatePresenceCount?: number
  public nsfwLevel!: number
  public premiumProgressBarEnabled!: boolean
  public applicationId!: Snowflake | null
  public maxStageVideoChannelUsers!: number
  public permissions?: string

  constructor(client: Client, data: GuildData) {
    super(client, data.id)

    this._patch(data)
  }

  protected _patch(data: GuildData): void {
    this.name = data.name
    this.icon = data.icon ?? null
    this.splash = data.splash ?? null
    this.discoverySplash = data.discovery_splash ?? null
    this.ownerId = data.owner_id
    this.region = data.region ?? ''
    this.afkChannelId = data.afk_channel_id ?? null
    this.afkTimeout = data.afk_timeout
    this.verificationLevel = data.verification_level
    this.defaultMessageNotifications = data.default_message_notifications
    this.explicitContentFilter = data.explicit_content_filter
    this.roles = new Map(
      data.roles.map((role) => [role.id, new Role(this.client, this, role)]),
    )
    this.emojis = new Map(
      data.emojis
        .filter(
          (emoji): emoji is EmojiData & { id: Snowflake } =>
            emoji.id !== undefined,
        )
        .map((emoji) => [emoji.id, new Emoji(this.client, this, emoji)]),
    )
    this.features = data.features
    this.mfaLevel = data.mfa_level
    this.systemChannelId = data.system_channel_id ?? null
    this.systemChannelFlags = data.system_channel_flags
    this.rulesChannelId = data.rules_channel_id ?? null
    this.maxPresences = data.max_presences ?? null
    this.maxMembers = data.max_members ?? 0
    this.vanityUrlCode = data.vanity_url_code ?? null
    this.description = data.description ?? null
    this.banner = data.banner ?? null
    this.premiumTier = data.premium_tier
    this.premiumSubscriptionCount = data.premium_subscription_count ?? 0
    this.preferredLocale = data.preferred_locale
    this.publicUpdatesChannelId = data.public_updates_channel_id ?? null
    this.maxVideoChannelUsers = data.max_video_channel_users ?? 0
    this.approximateMemberCount = data.approximate_member_count
    this.approximatePresenceCount = data.approximate_presence_count
    this.nsfwLevel = data.nsfw_level
    this.premiumProgressBarEnabled = data.premium_progress_bar_enabled
    this.applicationId = data.application_id ?? null
    this.maxStageVideoChannelUsers = data.max_video_channel_users ?? 0
    this.permissions =
      typeof data.permissions === 'string' ? data.permissions : undefined
  }

  /**
   * The URL to this guild's icon.
   */
  public get iconURL(): string | null {
    return this.icon
      ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.${this.icon.startsWith('a_') ? 'gif' : 'png'
      }`
      : null
  }

  /**
   * The URL to this guild's banner.
   */
  public get bannerURL(): string | null {
    return this.banner
      ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${this.banner.startsWith('a_') ? 'gif' : 'png'
      }`
      : null
  }

  /**
   * The URL to this guild's splash.
   */
  public get splashURL(): string | null {
    return this.splash
      ? `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.png`
      : null
  }

  /**
   * The URL to this guild's discovery splash.
   */
  public get discoverySplashURL(): string | null {
    return this.discoverySplash
      ? `https://cdn.discordapp.com/discovery-splashes/${this.id}/${this.discoverySplash}.png`
      : null
  }

  /**
   * Whether this guild is available to the client.
   */
  public get available(): boolean {
    return true
  }

  /**
   * Whether this guild is partnered.
   */
  public get partnered(): boolean {
    return this.features.includes('PARTNERED')
  }

  /**
   * Whether this guild is verified.
   */
  public get verified(): boolean {
    return this.features.includes('VERIFIED')
  }

  /**
   * The permissions number for the guild.
   */
  public get permissionsNumber(): bigint | null {
    return this.permissions ? BigInt(this.permissions) : null
  }
}
