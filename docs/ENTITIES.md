# Base Entities Implementation Plan

## Base Class

All entities will extend from a base class that provides common functionality:

```typescript
abstract class Base {
  // Core properties
  client: Client
  id: Snowflake
  
  // Timestamps
  createdTimestamp: number
  get createdAt(): Date
  
  // Methods
  equals(other: Base): boolean
  toString(): string
  toJSON(): unknown
  valueOf(): string
}
```

## Core Entities

### Guild (Server)
```typescript
class Guild extends Base {
  // Core properties
  name: string
  icon: string | null
  description: string | null
  ownerId: Snowflake
  
  // Settings
  region: string
  verificationLevel: GuildVerificationLevel
  defaultMessageNotifications: GuildDefaultMessageNotifications
  explicitContentFilter: GuildExplicitContentFilter
  
  // Features
  features: GuildFeature[]
  premiumTier: GuildPremiumTier
  premiumSubscriptionCount: number
  
  // Channels & Members
  private _channels: Collection<Snowflake, GuildChannel>
  private _members: Collection<Snowflake, GuildMember>
  private _roles: Collection<Snowflake, Role>
  private _emojis: Collection<Snowflake, GuildEmoji>
  
  // Accessors
  get channels(): Collection<Snowflake, GuildChannel>
  get members(): Collection<Snowflake, GuildMember>
  get roles(): Collection<Snowflake, Role>
  get emojis(): Collection<Snowflake, GuildEmoji>
  get owner(): GuildMember | null
  
  // Methods
  async fetch(): Promise<Guild>
  async edit(data: GuildEditData): Promise<Guild>
  async delete(): Promise<void>
  async leave(): Promise<void>
  
  // Channel methods
  async createChannel(data: ChannelCreateData): Promise<GuildChannel>
  async fetchChannels(): Promise<Collection<Snowflake, GuildChannel>>
  
  // Member methods
  async fetchMember(id: Snowflake): Promise<GuildMember>
  async fetchMembers(options?: FetchMembersOptions): Promise<Collection<Snowflake, GuildMember>>
  async addMember(user: UserResolvable, data: AddGuildMemberData): Promise<GuildMember>
  
  // Role methods
  async createRole(data: RoleCreateData): Promise<Role>
  async fetchRoles(): Promise<Collection<Snowflake, Role>>
  
  // Ban methods
  async fetchBans(): Promise<Collection<Snowflake, GuildBan>>
  async ban(user: UserResolvable, options?: BanOptions): Promise<GuildMember>
  async unban(user: UserResolvable): Promise<User>
}
```

### Channel
```typescript
abstract class BaseChannel extends Base {
  // Core properties
  type: ChannelType
  name?: string
  
  // Methods
  async delete(): Promise<void>
  async clone(): Promise<this>
  async edit(data: ChannelEditData): Promise<this>
  
  // Type guards
  isText(): this is TextChannel
  isVoice(): this is VoiceChannel
  isDM(): this is DMChannel
  isCategory(): this is CategoryChannel
  isNews(): this is NewsChannel
}

class TextChannel extends BaseChannel {
  // Text specific properties
  topic: string | null
  nsfw: boolean
  rateLimitPerUser: number
  lastMessageId: Snowflake | null
  
  // Messages
  async send(content: string | MessageOptions): Promise<Message>
  async bulkDelete(messages: number | Message[] | Snowflake[]): Promise<Collection<Snowflake, Message>>
  async fetchMessage(id: Snowflake): Promise<Message>
  async fetchMessages(options?: MessageFetchOptions): Promise<Collection<Snowflake, Message>>
  
  // Pins
  async fetchPinnedMessages(): Promise<Collection<Snowflake, Message>>
  async createWebhook(name: string, options?: WebhookCreateData): Promise<Webhook>
  async fetchWebhooks(): Promise<Collection<Snowflake, Webhook>>
}

class VoiceChannel extends BaseChannel {
  // Voice specific properties
  bitrate: number
  userLimit: number
  rtcRegion: string | null
  
  // Voice methods
  async join(): Promise<VoiceConnection>
  async leave(): Promise<void>
  async setRTCRegion(region: string | null): Promise<this>
}
```

### Message
```typescript
class Message extends Base {
  // Core properties
  content: string
  author: User
  channel: TextChannel | DMChannel
  guild: Guild | null
  member: GuildMember | null
  
  // Message data
  type: MessageType
  system: boolean
  pinned: boolean
  tts: boolean
  nonce: string | number | null
  
  // Mentions
  mentions: MessageMentions
  
  // Attachments & Embeds
  attachments: Collection<Snowflake, MessageAttachment>
  embeds: MessageEmbed[]
  components: MessageActionRow[]
  
  // Timestamps
  editedTimestamp: number | null
  get editedAt(): Date | null
  
  // Methods
  async edit(content: string | MessageEditOptions): Promise<Message>
  async delete(): Promise<Message>
  async pin(): Promise<Message>
  async unpin(): Promise<Message>
  async react(emoji: EmojiResolvable): Promise<MessageReaction>
  async fetch(): Promise<Message>
  
  // Reply methods
  async reply(content: string | MessageOptions): Promise<Message>
  async crosspost(): Promise<Message>
  
  // Utility
  equals(message: Message): boolean
  toString(): string
}
```

### User & Member
```typescript
class User extends Base {
  // Core properties
  username: string
  discriminator: string
  tag: string
  bot: boolean
  system: boolean
  
  // Profile
  avatar: string | null
  banner: string | null
  accentColor: number | null
  
  // Flags
  flags: UserFlags | null
  
  // Methods
  async fetch(): Promise<User>
  async createDM(): Promise<DMChannel>
  async deleteDM(): Promise<DMChannel>
  async send(content: string | MessageOptions): Promise<Message>
  
  // Utility
  displayAvatarURL(options?: ImageURLOptions): string
  displayBannerURL(options?: ImageURLOptions): string
  toString(): string
}

class GuildMember extends Base {
  // Core properties
  guild: Guild
  user: User
  nickname: string | null
  pending: boolean
  
  // Roles & Permissions
  roles: Collection<Snowflake, Role>
  permissions: Permissions
  
  // Timestamps
  joinedTimestamp: number
  premiumSinceTimestamp: number | null
  get joinedAt(): Date
  get premiumSince(): Date | null
  
  // Voice
  voice: VoiceState
  
  // Methods
  async edit(data: GuildMemberEditData): Promise<GuildMember>
  async kick(reason?: string): Promise<GuildMember>
  async ban(options?: BanOptions): Promise<GuildMember>
  async fetch(force?: boolean): Promise<GuildMember>
  async setNickname(nickname: string | null, reason?: string): Promise<GuildMember>
  
  // Role methods
  async addRole(role: RoleResolvable, reason?: string): Promise<GuildMember>
  async removeRole(role: RoleResolvable, reason?: string): Promise<GuildMember>
  
  // Utility
  toString(): string
  toJSON(): unknown
}
```

## Supporting Entities

### Role
```typescript
class Role extends Base {
  // Core properties
  name: string
  color: number
  hoist: boolean
  position: number
  permissions: Permissions
  managed: boolean
  mentionable: boolean
  
  // Methods
  async edit(data: RoleEditData): Promise<Role>
  async delete(reason?: string): Promise<Role>
  async setPosition(position: number): Promise<Role>
  
  // Utility
  comparePositionTo(role: Role): number
  toString(): string
}
```

### Emoji
```typescript
class GuildEmoji extends Base {
  // Core properties
  name: string
  requireColons: boolean
  managed: boolean
  animated: boolean
  available: boolean
  
  // Methods
  async edit(data: GuildEmojiEditData): Promise<GuildEmoji>
  async delete(): Promise<GuildEmoji>
  async fetchAuthor(): Promise<User>
  
  // Utility
  toString(): string
  imageURL(options?: ImageURLOptions): string
}
```

### Webhook
```typescript
class Webhook extends Base {
  // Core properties
  type: WebhookType
  guild: Guild | null
  channel: TextChannel | null
  owner: User | null
  name: string | null
  avatar: string | null
  token: string | null
  
  // Methods
  async edit(data: WebhookEditData): Promise<Webhook>
  async delete(reason?: string): Promise<void>
  async send(content: string | WebhookMessageOptions): Promise<Message | null>
  async fetchMessage(message: MessageResolvable): Promise<Message>
  async editMessage(message: MessageResolvable, data: string | WebhookEditMessageOptions): Promise<Message>
  async deleteMessage(message: MessageResolvable): Promise<void>
  
  // Utility
  avatarURL(options?: ImageURLOptions): string | null
}
```

## Implementation Notes

1. **Data Transformation**
   ```typescript
   // Transform raw API data to entity instances
   function transformGuild(data: APIGuild): Guild
   function transformChannel(data: APIChannel): BaseChannel
   function transformMessage(data: APIMessage): Message
   function transformUser(data: APIUser): User
   function transformMember(data: APIGuildMember, guild: Guild): GuildMember
   ```

2. **Caching Strategy**
   ```typescript
   // Entity caches
   class GuildManager extends CachedManager<Snowflake, Guild>
   class ChannelManager extends CachedManager<Snowflake, BaseChannel>
   class UserManager extends CachedManager<Snowflake, User>
   class MessageManager extends CachedManager<Snowflake, Message>
   ```

3. **Type Safety**
   ```typescript
   // Type guards
   function isGuild(value: any): value is Guild
   function isChannel(value: any): value is BaseChannel
   function isMessage(value: any): value is Message
   function isUser(value: any): value is User
   function isMember(value: any): value is GuildMember
   ```

4. **Utility Methods**
   ```typescript
   // Resolvers
   function resolveGuild(guild: GuildResolvable): Guild | null
   function resolveChannel(channel: ChannelResolvable): BaseChannel | null
   function resolveUser(user: UserResolvable): User | null
   function resolveRole(role: RoleResolvable): Role | null
   ```

5. **Error Handling**
   ```typescript
   // Custom errors
   class DiscordAPIError extends Error
   class HTTPError extends Error
   class DiscordError extends Error
   ``` 