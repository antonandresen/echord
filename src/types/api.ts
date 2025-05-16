import type { Snowflake } from '.'

/**
 * https://discord.com/developers/docs/resources/guild#guild-object
 */
export interface APIGuild {
  id: Snowflake
  name: string
  icon: string | null
  splash: string | null
  discovery_splash: string | null
  owner_id: Snowflake
  region: string
  afk_channel_id: Snowflake | null
  afk_timeout: number
  verification_level: number
  default_message_notifications: number
  explicit_content_filter: number
  roles: APIRole[]
  emojis: APIEmoji[]
  features: GuildFeature[]
  mfa_level: number
  application_id: Snowflake | null
  system_channel_id: Snowflake | null
  system_channel_flags: number
  rules_channel_id: Snowflake | null
  max_presences: number | null
  max_members: number
  vanity_url_code: string | null
  description: string | null
  banner: string | null
  premium_tier: number
  premium_subscription_count?: number
  preferred_locale: string
  public_updates_channel_id: Snowflake | null
  max_video_channel_users?: number
  max_stage_video_channel_users?: number
  approximate_member_count?: number
  approximate_presence_count?: number
  welcome_screen?: APIGuildWelcomeScreen
  nsfw_level: number
  stickers?: APISticker[]
  premium_progress_bar_enabled: boolean
  permissions?: string
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-verification-level
 */
export enum GuildVerificationLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level
 */
export enum GuildDefaultMessageNotifications {
  ALL_MESSAGES = 0,
  ONLY_MENTIONS = 1
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level
 */
export enum GuildExplicitContentFilter {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-mfa-level
 */
export enum GuildMFALevel {
  NONE = 0,
  ELEVATED = 1
}

/**
 * Guild features
 * @see https://discord.com/developers/docs/resources/guild#guild-object-guild-features
 */
export enum GuildFeature {
  ANIMATED_BANNER = 'ANIMATED_BANNER',
  ANIMATED_ICON = 'ANIMATED_ICON',
  APPLICATION_COMMAND_PERMISSIONS_V2 = 'APPLICATION_COMMAND_PERMISSIONS_V2',
  AUTO_MODERATION = 'AUTO_MODERATION',
  BANNER = 'BANNER',
  COMMUNITY = 'COMMUNITY',
  CREATOR_MONETIZABLE_PROVISIONAL = 'CREATOR_MONETIZABLE_PROVISIONAL',
  CREATOR_STORE_PAGE = 'CREATOR_STORE_PAGE',
  DEVELOPER_SUPPORT_SERVER = 'DEVELOPER_SUPPORT_SERVER',
  DISCOVERABLE = 'DISCOVERABLE',
  FEATURABLE = 'FEATURABLE',
  INVITES_DISABLED = 'INVITES_DISABLED',
  INVITE_SPLASH = 'INVITE_SPLASH',
  MEMBER_VERIFICATION_GATE_ENABLED = 'MEMBER_VERIFICATION_GATE_ENABLED',
  MORE_STICKERS = 'MORE_STICKERS',
  NEWS = 'NEWS',
  PARTNERED = 'PARTNERED',
  PREVIEW_ENABLED = 'PREVIEW_ENABLED',
  RAID_ALERTS_DISABLED = 'RAID_ALERTS_DISABLED',
  ROLE_ICONS = 'ROLE_ICONS',
  ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE = 'ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE',
  ROLE_SUBSCRIPTIONS_ENABLED = 'ROLE_SUBSCRIPTIONS_ENABLED',
  TICKETED_EVENTS_ENABLED = 'TICKETED_EVENTS_ENABLED',
  VANITY_URL = 'VANITY_URL',
  VERIFIED = 'VERIFIED',
  VIP_REGIONS = 'VIP_REGIONS',
  WELCOME_SCREEN_ENABLED = 'WELCOME_SCREEN_ENABLED',
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
 */
export enum SystemChannelFlags {
  SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
  SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
  SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
  SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-premium-tier
 */
export enum GuildPremiumTier {
  NONE = 0,
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-nsfw-level
 */
export enum GuildNSFWLevel {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3
}

/**
 * https://discord.com/developers/docs/resources/guild#welcome-screen-object
 */
export interface APIGuildWelcomeScreen {
  description: string | null
  welcome_channels: APIGuildWelcomeScreenChannel[]
}

/**
 * https://discord.com/developers/docs/resources/guild#welcome-screen-object-welcome-screen-channel-structure
 */
export interface APIGuildWelcomeScreenChannel {
  channel_id: Snowflake
  description: string
  emoji_id: Snowflake | null
  emoji_name: string | null
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-role-object
 */
export interface APIRole {
  id: Snowflake
  name: string
  color: number
  hoist: boolean
  icon?: string | null
  unicode_emoji?: string | null
  position: number
  permissions: string
  managed: boolean
  mentionable: boolean
  tags?: APIRoleTags
}

/**
 * https://discord.com/developers/docs/resources/guild#role-object-role-tags-structure
 */
export interface APIRoleTags {
  bot_id?: Snowflake
  integration_id?: Snowflake
  premium_subscriber?: null
  subscription_listing_id?: Snowflake
  available_for_purchase?: null
  guild_connections?: null
}

/**
 * https://discord.com/developers/docs/resources/emoji#emoji-object
 */
export interface APIEmoji {
  id: Snowflake | null
  name: string | null
  roles?: Snowflake[]
  user?: APIUser
  require_colons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean
}

/**
 * https://discord.com/developers/docs/resources/sticker#sticker-object
 */
export interface APISticker {
  id: Snowflake
  pack_id?: Snowflake
  name: string
  description: string | null
  tags: string
  asset?: string
  type: StickerType
  format_type: StickerFormatType
  available?: boolean
  guild_id?: Snowflake
  user?: APIUser
  sort_value?: number
}

/**
 * https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types
 */
export enum StickerType {
  STANDARD = 1,
  GUILD = 2
}

/**
 * https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types
 */
export enum StickerFormatType {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3
}

/**
 * https://discord.com/developers/docs/resources/user#user-object
 */
export interface APIUser {
  id: Snowflake
  username: string
  discriminator: string
  avatar: string | null
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string | null
  accent_color?: number | null
  locale?: string
  verified?: boolean
  email?: string | null
  flags?: UserFlags
  premium_type?: PremiumType
  public_flags?: UserFlags
}

/**
 * https://discord.com/developers/docs/resources/user#user-object-user-flags
 */
export enum UserFlags {
  STAFF = 1 << 0,
  PARTNER = 1 << 1,
  HYPESQUAD = 1 << 2,
  BUG_HUNTER_LEVEL_1 = 1 << 3,
  HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6,
  HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7,
  HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8,
  PREMIUM_EARLY_SUPPORTER = 1 << 9,
  TEAM_PSEUDO_USER = 1 << 10,
  BUG_HUNTER_LEVEL_2 = 1 << 14,
  VERIFIED_BOT = 1 << 16,
  VERIFIED_DEVELOPER = 1 << 17,
  CERTIFIED_MODERATOR = 1 << 18,
  BOT_HTTP_INTERACTIONS = 1 << 19,
  ACTIVE_DEVELOPER = 1 << 22
}

/**
 * https://discord.com/developers/docs/resources/user#user-object-premium-types
 */
export enum PremiumType {
  NONE = 0,
  NITRO_CLASSIC = 1,
  NITRO = 2,
  NITRO_BASIC = 3
}

/**
 * Channel types
 * @see https://discord.com/developers/docs/resources/channel#channel-object-channel-types
 */
export enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_ANNOUNCEMENT = 5,
  ANNOUNCEMENT_THREAD = 10,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
  GUILD_DIRECTORY = 14,
  GUILD_FORUM = 15,
  GUILD_MEDIA = 16,
} 