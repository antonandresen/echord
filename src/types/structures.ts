import type { Snowflake } from './index'

export type { Snowflake }

/**
 * Base structure data
 */
export interface BaseData {
  id: Snowflake
  [key: string]: unknown
}

/**
 * Guild member data
 */
export interface MemberData extends BaseData {
  user: UserData
  nick?: string
  avatar?: string
  roles: Snowflake[]
  joined_at: string
  premium_since?: string
  deaf: boolean
  mute: boolean
  pending?: boolean
  communication_disabled_until?: string
}

/**
 * User data
 */
export interface UserData extends BaseData {
  username: string
  discriminator: string
  avatar?: string
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string
  accent_color?: number
  locale?: string
  verified?: boolean
  email?: string
  flags?: number
  premium_type?: number
  public_flags?: number
  avatar_decoration?: string
}

/**
 * Role data
 */
export interface RoleData extends BaseData {
  name: string
  color: number
  hoist: boolean
  icon?: string
  unicode_emoji?: string
  position: number
  permissions: string
  managed: boolean
  mentionable: boolean
  tags?: {
    bot_id?: Snowflake
    integration_id?: Snowflake
    premium_subscriber?: boolean
    subscription_listing_id?: Snowflake
    available_for_purchase?: boolean
    guild_connections?: boolean
  }
}

/**
 * Guild data
 */
export interface GuildData extends BaseData {
  name: string
  icon?: string
  splash?: string
  discovery_splash?: string
  owner_id: Snowflake
  region?: string
  afk_channel_id?: Snowflake
  afk_timeout: number
  verification_level: number
  default_message_notifications: number
  explicit_content_filter: number
  roles: RoleData[]
  emojis: EmojiData[]
  features: string[]
  mfa_level: number
  application_id?: Snowflake
  system_channel_id?: Snowflake
  system_channel_flags: number
  rules_channel_id?: Snowflake
  max_presences?: number
  max_members?: number
  vanity_url_code?: string
  description?: string
  banner?: string
  premium_tier: number
  premium_subscription_count?: number
  preferred_locale: string
  public_updates_channel_id?: Snowflake
  max_video_channel_users?: number
  approximate_member_count?: number
  approximate_presence_count?: number
  nsfw_level: number
  premium_progress_bar_enabled: boolean
}

/**
 * Channel data
 */
export interface ChannelData extends BaseData {
  type: number
  guild_id?: Snowflake
  position?: number
  permission_overwrites?: OverwriteData[]
  name?: string
  topic?: string
  nsfw?: boolean
  last_message_id?: Snowflake
  bitrate?: number
  user_limit?: number
  rate_limit_per_user?: number
  recipients?: UserData[]
  icon?: string
  owner_id?: Snowflake
  application_id?: Snowflake
  parent_id?: Snowflake
  last_pin_timestamp?: string
  rtc_region?: string
  video_quality_mode?: number
  message_count?: number
  member_count?: number
  thread_metadata?: ThreadMetadataData
  member?: ThreadMemberData
  default_auto_archive_duration?: number
  permissions?: string
  flags?: number
  total_message_sent?: number
  available_tags?: ForumTagData[]
  applied_tags?: Snowflake[]
  default_reaction_emoji?: DefaultReactionData
  default_thread_rate_limit_per_user?: number
  default_sort_order?: number
  default_forum_layout?: number
}

/**
 * Message data
 */
export interface MessageData extends BaseData {
  channel_id: Snowflake
  guild_id?: Snowflake
  author: UserData
  content: string
  timestamp: string
  edited_timestamp?: string
  tts: boolean
  mention_everyone: boolean
  mentions: UserData[]
  mention_roles: Snowflake[]
  mention_channels?: ChannelMentionData[]
  attachments: AttachmentData[]
  embeds: EmbedData[]
  reactions?: ReactionData[]
  nonce?: string | number
  pinned: boolean
  webhook_id?: Snowflake
  type: number
  activity?: MessageActivityData
  application?: ApplicationData
  application_id?: Snowflake
  message_reference?: MessageReferenceData
  flags?: number
  referenced_message?: MessageData | null
  interaction?: MessageInteractionData
  thread?: ChannelData
  components?: ComponentData[]
  sticker_items?: StickerItemData[]
  stickers?: StickerData[]
  position?: number
  role_subscription_data?: RoleSubscriptionData
}

/**
 * Emoji data
 */
export interface EmojiData extends BaseData {
  name: string
  roles?: Snowflake[]
  user?: UserData
  require_colons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean
}

/**
 * Avatar URL options
 */
export interface AvatarURLOptions {
  format?: 'webp' | 'png' | 'jpg' | 'jpeg' | 'gif'
  size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096
}

// Additional types needed for the above interfaces
export interface OverwriteData {
  id: Snowflake
  type: number
  allow: string
  deny: string
}

export interface ThreadMetadataData {
  archived: boolean
  auto_archive_duration: number
  archive_timestamp: string
  locked: boolean
  invitable?: boolean
  create_timestamp?: string
}

export interface ThreadMemberData {
  id?: Snowflake
  user_id?: Snowflake
  join_timestamp: string
  flags: number
}

export interface ForumTagData {
  id: Snowflake
  name: string
  moderated: boolean
  emoji_id?: Snowflake
  emoji_name?: string
}

export interface DefaultReactionData {
  emoji_id?: Snowflake
  emoji_name?: string
}

export interface ChannelMentionData {
  id: Snowflake
  guild_id: Snowflake
  type: number
  name: string
}

export interface AttachmentData {
  id: Snowflake
  filename: string
  description?: string
  content_type?: string
  size: number
  url: string
  proxy_url: string
  height?: number
  width?: number
  ephemeral?: boolean
  duration_secs?: number
  waveform?: string
  flags?: number
}

export interface EmbedData {
  title?: string
  type?: string
  description?: string
  url?: string
  timestamp?: string
  color?: number
  footer?: EmbedFooterData
  image?: EmbedImageData
  thumbnail?: EmbedThumbnailData
  video?: EmbedVideoData
  provider?: EmbedProviderData
  author?: EmbedAuthorData
  fields?: EmbedFieldData[]
}

export interface EmbedFooterData {
  text: string
  icon_url?: string
  proxy_icon_url?: string
}

export interface EmbedImageData {
  url: string
  proxy_url?: string
  height?: number
  width?: number
}

export interface EmbedThumbnailData {
  url: string
  proxy_url?: string
  height?: number
  width?: number
}

export interface EmbedVideoData {
  url?: string
  proxy_url?: string
  height?: number
  width?: number
}

export interface EmbedProviderData {
  name?: string
  url?: string
}

export interface EmbedAuthorData {
  name: string
  url?: string
  icon_url?: string
  proxy_icon_url?: string
}

export interface EmbedFieldData {
  name: string
  value: string
  inline?: boolean
}

export interface ReactionData {
  count: number
  me: boolean
  emoji: EmojiData
}

export interface MessageActivityData {
  type: number
  party_id?: string
}

export interface ApplicationData {
  id: Snowflake
  name: string
  icon?: string
  description: string
  rpc_origins?: string[]
  bot_public: boolean
  bot_require_code_grant: boolean
  terms_of_service_url?: string
  privacy_policy_url?: string
  owner?: UserData
  verify_key: string
  team?: TeamData
  guild_id?: Snowflake
  primary_sku_id?: Snowflake
  slug?: string
  cover_image?: string
  flags?: number
  tags?: string[]
  install_params?: InstallParamsData
  custom_install_url?: string
}

export interface TeamData {
  icon?: string
  id: Snowflake
  members: TeamMemberData[]
  name: string
  owner_user_id: Snowflake
}

export interface TeamMemberData {
  membership_state: number
  permissions: string[]
  team_id: Snowflake
  user: UserData
}

export interface InstallParamsData {
  scopes: string[]
  permissions: string
}

export interface MessageReferenceData {
  message_id?: Snowflake
  channel_id?: Snowflake
  guild_id?: Snowflake
  fail_if_not_exists?: boolean
}

export interface MessageInteractionData {
  id: Snowflake
  type: number
  name: string
  user: UserData
  member?: Partial<MemberData>
}

export interface ComponentData {
  type: number
  style?: number
  label?: string
  emoji?: Partial<EmojiData>
  custom_id?: string
  url?: string
  disabled?: boolean
  components?: ComponentData[]
  options?: SelectOptionData[]
  placeholder?: string
  min_values?: number
  max_values?: number
  min_length?: number
  max_length?: number
  required?: boolean
  value?: string
}

export interface SelectOptionData {
  label: string
  value: string
  description?: string
  emoji?: Partial<EmojiData>
  default?: boolean
}

export interface StickerItemData {
  id: Snowflake
  name: string
  format_type: number
}

export interface StickerData extends StickerItemData {
  pack_id?: Snowflake
  description?: string
  tags: string
  asset?: string
  type: number
  available?: boolean
  guild_id?: Snowflake
  user?: UserData
  sort_value?: number
}

export interface RoleSubscriptionData {
  role_subscription_listing_id: Snowflake
  tier_name: string
  total_months_subscribed: number
  is_renewal: boolean
}
