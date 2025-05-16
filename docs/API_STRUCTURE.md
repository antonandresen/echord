# Discord API Structure

## Base Structures

### Guild (Server)
```typescript
class Guild extends Base {
  // Properties
  id: Snowflake
  name: string
  icon: string | null
  // ... other Discord properties

  // Accessors
  get channels(): Collection<Snowflake, Channel>
  get members(): Collection<Snowflake, GuildMember>
  get roles(): Collection<Snowflake, Role>
  
  // Methods
  async edit(data: GuildEditData): Promise<Guild>
  async delete(): Promise<void>
  async createChannel(data: ChannelCreateData): Promise<Channel>
  async createRole(data: RoleCreateData): Promise<Role>
  async fetchAuditLogs(options?: AuditLogFetchOptions): Promise<AuditLogEntry[]>
  // ... other methods
}
```

### Channel
```typescript
abstract class BaseChannel extends Base {
  id: Snowflake
  type: ChannelType
  // ... common properties

  async delete(): Promise<void>
  async edit(data: ChannelEditData): Promise<this>
}

class TextChannel extends BaseChannel {
  type: ChannelType.GUILD_TEXT
  topic: string | null
  lastMessageId: Snowflake | null
  
  async send(content: string | MessageOptions): Promise<Message>
  async bulkDelete(messages: number | Message[] | Snowflake[]): Promise<void>
  // ... text channel specific methods
}

class VoiceChannel extends BaseChannel {
  type: ChannelType.GUILD_VOICE
  bitrate: number
  userLimit: number
  
  async join(): Promise<VoiceConnection>
  async leave(): Promise<void>
  // ... voice channel specific methods
}

// Other channel types...
```

### Message
```typescript
class Message extends Base {
  id: Snowflake
  content: string
  author: User
  member: GuildMember | null
  channel: TextChannel | DMChannel
  // ... other properties

  async edit(content: string | MessageEditOptions): Promise<Message>
  async delete(): Promise<void>
  async pin(): Promise<void>
  async unpin(): Promise<void>
  async react(emoji: string | Emoji): Promise<MessageReaction>
  // ... other methods
}
```

### User & Member
```typescript
class User extends Base {
  id: Snowflake
  username: string
  discriminator: string
  avatar: string | null
  // ... other properties

  async send(content: string | MessageOptions): Promise<Message>
  async createDM(): Promise<DMChannel>
  // ... other methods
}

class GuildMember extends Base {
  user: User
  guild: Guild
  nickname: string | null
  roles: Collection<Snowflake, Role>
  // ... other properties

  async edit(data: GuildMemberEditData): Promise<GuildMember>
  async kick(reason?: string): Promise<void>
  async ban(options?: BanOptions): Promise<void>
  async unban(): Promise<void>
  // ... other methods
}
```

## Managers

### GuildManager
```typescript
class GuildManager extends BaseManager<Snowflake, Guild> {
  async create(data: GuildCreateData): Promise<Guild>
  async fetch(id: Snowflake): Promise<Guild>
  async edit(id: Snowflake, data: GuildEditData): Promise<Guild>
  async delete(id: Snowflake): Promise<void>
}
```

### ChannelManager
```typescript
class ChannelManager extends BaseManager<Snowflake, Channel> {
  async create(guild: Guild, data: ChannelCreateData): Promise<Channel>
  async fetch(id: Snowflake): Promise<Channel>
  async edit(id: Snowflake, data: ChannelEditData): Promise<Channel>
  async delete(id: Snowflake): Promise<void>
}
```

## Events

### Message Events
```typescript
interface MessageCreateEvent {
  message: Message
}

interface MessageUpdateEvent {
  oldMessage: Message | null  // null if not cached
  newMessage: Message
}

interface MessageDeleteEvent {
  message: Message | null  // null if not cached
  id: Snowflake
  channelId: Snowflake
  guildId?: Snowflake
}
```

### Guild Events
```typescript
interface GuildCreateEvent {
  guild: Guild
}

interface GuildUpdateEvent {
  oldGuild: Guild | null
  newGuild: Guild
}

interface GuildDeleteEvent {
  guild: Guild | null
  id: Snowflake
}
```

### Member Events
```typescript
interface GuildMemberAddEvent {
  member: GuildMember
}

interface GuildMemberUpdateEvent {
  oldMember: GuildMember | null
  newMember: GuildMember
}

interface GuildMemberRemoveEvent {
  member: GuildMember | null
  user: User
  guild: Guild
}
```

## Cache System

### Base Cache
```typescript
interface CacheOptions {
  maxSize?: number
  sweepInterval?: number
  sweepFilter?: (value: any, key: any) => boolean
}

class BaseCache<K, V> extends Collection<K, V> {
  constructor(options?: CacheOptions)
  sweep(filter: (value: V, key: K) => boolean): number
  clear(): void
}
```

### Specialized Caches
```typescript
class GuildCache extends BaseCache<Snowflake, Guild> {
  // Guild-specific caching logic
}

class ChannelCache extends BaseCache<Snowflake, Channel> {
  // Channel-specific caching logic
}

class MessageCache extends BaseCache<Snowflake, Message> {
  // Message-specific caching logic with LRU
}
```

## Client Structure

```typescript
class Client extends EventEmitter {
  // Core components
  rest: RESTClient
  ws: WebSocketManager
  voice: VoiceManager

  // Managers
  guilds: GuildManager
  channels: ChannelManager
  users: UserManager
  
  // Caches
  private guildCache: GuildCache
  private channelCache: ChannelCache
  private userCache: UserCache

  // Methods
  async login(token: string): Promise<void>
  destroy(): void
  
  // Fetch methods
  async fetchGuild(id: Snowflake): Promise<Guild>
  async fetchChannel(id: Snowflake): Promise<Channel>
  async fetchUser(id: Snowflake): Promise<User>
}
```

## Implementation Notes

1. **Caching Strategy**
   - Default LRU cache for messages
   - Configurable cache sizes
   - Sweep intervals for cleanup
   - Optional Redis integration

2. **Type Safety**
   - Strict TypeScript types
   - No `any` usage
   - Proper type guards
   - Comprehensive JSDoc

3. **Error Handling**
   - Custom error classes
   - Detailed error messages
   - Stack traces
   - Debug mode

4. **Performance**
   - Efficient data structures
   - Minimal object creation
   - Smart caching
   - Request batching

5. **Developer Experience**
   - Fluent interfaces
   - Method chaining
   - Builder patterns
   - Comprehensive documentation 