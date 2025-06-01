import type { Message } from '../structures/Message'
import type { Guild } from '../structures/Guild'
import type { Member } from '../structures/Member'
import type { Role } from '../structures/Role'
import type { Channel } from '../structures/Channel'
import type { User } from '../structures/User'

/**
 * Options for a client instance
 */
export interface ClientOptions {
  /**
   * The gateway intents to enable
   * @default 0
   */
  intents?: number

  /**
   * The number of shards to spawn
   * @default 'auto'
   */
  shards?: number | 'auto'

  /**
   * The total number of shards
   * @default 1
   */
  shardCount?: number

  /**
   * Time in milliseconds to wait for the connection to close
   * @default 5000
   */
  closeTimeout?: number

  /**
   * Number of times to retry a failed API request
   * @default 5
   */
  retryLimit?: number
}

/**
 * Events that can be emitted by the client
 */
export interface ClientEvents {
  /**
   * Emitted when the client becomes ready to start working
   */
  ready: () => void

  /**
   * Emitted when the client encounters an error
   */
  error: (error: Error) => void

  /**
   * Emitted when a message is created
   */
  messageCreate: (message: Message) => void

  /**
   * Emitted when a message is updated
   */
  messageUpdate: (oldMessage: Message | null, newMessage: Message) => void

  /**
   * Emitted when a message is deleted
   */
  messageDelete: (message: Message) => void

  /**
   * Emitted when a guild becomes available
   */
  guildCreate: (guild: Guild) => void

  /**
   * Emitted when a guild member is added
   */
  guildMemberAdd: (member: Member) => void

  /**
   * Emitted when a guild member is removed
   */
  guildMemberRemove: (member: Member) => void

  /**
   * Emitted when a guild member is updated
   */
  guildMemberUpdate: (oldMember: Member | null, newMember: Member) => void

  /**
   * Emitted when a guild role is created
   */
  roleCreate: (role: Role) => void

  /**
   * Emitted when a guild role is updated
   */
  roleUpdate: (oldRole: Role | null, newRole: Role) => void

  /**
   * Emitted when a guild role is deleted
   */
  roleDelete: (role: Role) => void

  /**
   * Emitted when a channel is created
   */
  channelCreate: (channel: Channel) => void

  /**
   * Emitted when a channel is updated
   */
  channelUpdate: (oldChannel: Channel | null, newChannel: Channel) => void

  /**
   * Emitted when a channel is deleted
   */
  channelDelete: (channel: Channel) => void

  /**
   * Emitted when a user starts typing in a channel
   */
  typingStart: (typing: unknown) => void

  /**
   * Emitted when a user's presence is updated
   */
  presenceUpdate: (oldPresence: unknown | null, newPresence: unknown) => void

  /**
   * Emitted when a user is updated
   */
  userUpdate: (oldUser: User | null, newUser: User) => void

  /**
   * Emitted when a voice state is updated
   */
  voiceStateUpdate: (oldState: unknown | null, newState: unknown) => void

  /**
   * Emitted when the client's session is invalidated
   */
  invalidated: () => void

  /**
   * Emitted when the client's WebSocket connection encounters an error
   */
  wsError: (error: Error) => void

  /**
   * Emitted when the client's WebSocket connection closes
   */
  wsClose: (code: number, reason: string) => void

  /**
   * Emitted when debug information is output
   */
  debug: (info: string) => void

  /**
   * Emitted when a rate limit is hit
   */
  rateLimit: (rateLimitInfo: unknown) => void

  /**
   * Emitted when a shard becomes ready
   */
  shardReady: (shardId: number) => void

  /**
   * Emitted when a shard encounters an error
   */
  shardError: (error: Error, shardId: number) => void

  /**
   * Emitted when a shard's WebSocket connection closes
   */
  shardClose: (code: number, reason: string, shardId: number) => void

  /**
   * Emitted when a shard resumes its session
   */
  shardResume: (shardId: number) => void

  /**
   * Emitted when a shard reconnects
   */
  shardReconnect: (shardId: number) => void
}
