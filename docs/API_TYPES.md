# Discord API Types

## Base Types

### Snowflake
```typescript
type Snowflake = string

interface SnowflakeUtil {
  generate(): Snowflake
  deconstruct(snowflake: Snowflake): {
    timestamp: number
    workerId: number
    processId: number
    increment: number
    date: Date
  }
}
```

### Permissions
```typescript
enum PermissionFlags {
  CREATE_INSTANT_INVITE = 1 << 0,
  KICK_MEMBERS = 1 << 1,
  BAN_MEMBERS = 1 << 2,
  ADMINISTRATOR = 1 << 3,
  MANAGE_CHANNELS = 1 << 4,
  // ... all Discord permission flags
}

class Permissions {
  bitfield: number
  
  has(permission: PermissionFlags | PermissionFlags[]): boolean
  add(...permissions: PermissionFlags[]): this
  remove(...permissions: PermissionFlags[]): this
  serialize(): Record<keyof typeof PermissionFlags, boolean>
}
```

### Intents
```typescript
enum GatewayIntents {
  GUILDS = 1 << 0,
  GUILD_MEMBERS = 1 << 1,
  GUILD_BANS = 1 << 2,
  GUILD_EMOJIS = 1 << 3,
  // ... all Discord gateway intents
}

class Intents {
  bitfield: number
  
  has(intent: GatewayIntents | GatewayIntents[]): boolean
  add(...intents: GatewayIntents[]): this
  remove(...intents: GatewayIntents[]): this
  serialize(): Record<keyof typeof GatewayIntents, boolean>
}
```

## API Structures

### Guild
```typescript
interface APIGuild {
  id: Snowflake
  name: string
  icon: string | null
  splash: string | null
  discovery_splash: string | null
  owner_id: Snowflake
  region: string
  afk_channel_id: Snowflake | null
  afk_timeout: number
  verification_level: GuildVerificationLevel
  default_message_notifications: GuildDefaultMessageNotifications
  explicit_content_filter: GuildExplicitContentFilter
  roles: APIRole[]
  emojis: APIEmoji[]
  features: GuildFeature[]
  mfa_level: GuildMFALevel
  system_channel_id: Snowflake | null
  system_channel_flags: SystemChannelFlags
  rules_channel_id: Snowflake | null
  max_presences: number | null
  max_members: number
  vanity_url_code: string | null
  description: string | null
  banner: string | null
  premium_tier: GuildPremiumTier
  premium_subscription_count: number
  preferred_locale: string
  public_updates_channel_id: Snowflake | null
  max_video_channel_users: number
  approximate_member_count: number
  approximate_presence_count: number
  welcome_screen: APIGuildWelcomeScreen
  nsfw_level: GuildNSFWLevel
  stickers: APISticker[]
  premium_progress_bar_enabled: boolean
}
```

### Channel
```typescript
enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  // ... all channel types
}

interface APIChannel {
  id: Snowflake
  type: ChannelType
  guild_id?: Snowflake
  position?: number
  permission_overwrites?: APIOverwrite[]
  name?: string
  topic?: string | null
  nsfw?: boolean
  last_message_id?: Snowflake | null
  bitrate?: number
  user_limit?: number
  rate_limit_per_user?: number
  recipients?: APIUser[]
  icon?: string | null
  owner_id?: Snowflake
  application_id?: Snowflake
  parent_id?: Snowflake | null
  last_pin_timestamp?: string | null
  rtc_region?: string | null
  video_quality_mode?: VideoQualityMode
  message_count?: number
  member_count?: number
  thread_metadata?: APIThreadMetadata
  member?: APIThreadMember
  default_auto_archive_duration?: number
  permissions?: string
  flags?: ChannelFlags
  total_message_sent?: number
}
```

### Message
```typescript
interface APIMessage {
  id: Snowflake
  channel_id: Snowflake
  guild_id?: Snowflake
  author: APIUser
  member?: APIGuildMember
  content: string
  timestamp: string
  edited_timestamp: string | null
  tts: boolean
  mention_everyone: boolean
  mentions: APIUser[]
  mention_roles: Snowflake[]
  mention_channels?: APIChannelMention[]
  attachments: APIAttachment[]
  embeds: APIEmbed[]
  reactions?: APIReaction[]
  nonce?: string | number
  pinned: boolean
  webhook_id?: Snowflake
  type: MessageType
  activity?: APIMessageActivity
  application?: APIApplication
  application_id?: Snowflake
  message_reference?: APIMessageReference
  flags?: MessageFlags
  referenced_message?: APIMessage | null
  interaction?: APIMessageInteraction
  thread?: APIChannel
  components?: APIActionRow[]
  sticker_items?: APIStickerItem[]
}
```

### User
```typescript
interface APIUser {
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
```

## Gateway Types

### Payload
```typescript
interface GatewayPayload {
  op: GatewayOPCodes
  d?: unknown
  s?: number
  t?: string
}

interface GatewayIdentify {
  token: string
  properties: {
    os: string
    browser: string
    device: string
  }
  compress?: boolean
  large_threshold?: number
  shard?: [number, number]
  presence?: GatewayPresenceUpdateData
  intents: number
}

interface GatewayResume {
  token: string
  session_id: string
  seq: number
}
```

### Events
```typescript
interface GatewayReceivePayload {
  READY: {
    v: number
    user: APIUser
    guilds: APIUnavailableGuild[]
    session_id: string
    resume_gateway_url: string
    shard?: [number, number]
  }
  MESSAGE_CREATE: APIMessage
  GUILD_CREATE: APIGuild
  // ... all gateway events
}

interface GatewaySendPayload {
  IDENTIFY: GatewayIdentify
  RESUME: GatewayResume
  HEARTBEAT: number | null
  REQUEST_GUILD_MEMBERS: {
    guild_id: Snowflake
    query?: string
    limit: number
    presences?: boolean
    user_ids?: Snowflake | Snowflake[]
    nonce?: string
  }
  // ... all gateway commands
}
```

## REST Types

### Endpoints
```typescript
interface RESTGetAPIChannelMessage {
  channelId: Snowflake
  messageId: Snowflake
}

interface RESTPostAPIChannelMessage {
  channelId: Snowflake
  body: {
    content?: string
    tts?: boolean
    embeds?: APIEmbed[]
    allowed_mentions?: APIAllowedMentions
    message_reference?: APIMessageReference
    components?: APIActionRow[]
    sticker_ids?: Snowflake[]
    files?: unknown[]
    attachments?: APIAttachment[]
    flags?: MessageFlags
  }
}

// ... all REST endpoints
```

### Options
```typescript
interface RequestOptions {
  headers?: Record<string, string>
  body?: unknown
  query?: Record<string, string>
  reason?: string
  auth?: boolean
  files?: unknown[]
}

interface RESTOptions {
  api: string
  cdn: string
  version: string
  requestTimeout: number
  retryLimit: number
  agent?: unknown
}
```

## Utility Types

### Collections
```typescript
class Collection<K, V> extends Map<K, V> {
  find(fn: (value: V, key: K) => boolean): V | undefined
  filter(fn: (value: V, key: K) => boolean): Collection<K, V>
  map<T>(fn: (value: V, key: K) => T): T[]
  reduce<T>(fn: (acc: T, value: V, key: K) => T, initialValue: T): T
  // ... other utility methods
}
```

### Builders
```typescript
class EmbedBuilder {
  data: APIEmbed
  
  setTitle(title: string): this
  setDescription(description: string): this
  setColor(color: number | string): this
  setTimestamp(timestamp?: Date | number): this
  // ... other builder methods
}

class ActionRowBuilder {
  data: APIActionRow
  
  addComponents(...components: APIMessageComponent[]): this
  setComponents(components: APIMessageComponent[]): this
}
```

## Implementation Notes

1. **Type Guards**
   ```typescript
   function isGuild(value: unknown): value is Guild
   function isMessage(value: unknown): value is Message
   function isUser(value: unknown): value is User
   ```

2. **Type Transformers**
   ```typescript
   function transformAPIGuild(data: APIGuild): Guild
   function transformAPIMessage(data: APIMessage): Message
   function transformAPIUser(data: APIUser): User
   ```

3. **Type Utilities**
   ```typescript
   type Mutable<T> = { -readonly [P in keyof T]: T[P] }
   type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }
   type Nullable<T> = { [P in keyof T]: T[P] | null }
   ```

4. **Constants**
   ```typescript
   const API_VERSION = 'v10'
   const CDN_URL = 'https://cdn.discordapp.com'
   const DEFAULT_RETRY_LIMIT = 3
   const MAX_MESSAGE_LENGTH = 2000
   ``` 