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
  messageCreate: (message: any) => void

  /**
   * Emitted when a message is updated
   */
  messageUpdate: (oldMessage: any | null, newMessage: any) => void

  /**
   * Emitted when a message is deleted
   */
  messageDelete: (message: any) => void

  /**
   * Emitted when a guild becomes available
   */
  guildCreate: (guild: any) => void

  /**
   * Emitted when a guild member is added
   */
  guildMemberAdd: (member: any) => void

  /**
   * Emitted when a guild member is removed
   */
  guildMemberRemove: (member: any) => void

  /**
   * Emitted when a guild member is updated
   */
  guildMemberUpdate: (oldMember: any | null, newMember: any) => void

  /**
   * Emitted when a guild role is created
   */
  roleCreate: (role: any) => void

  /**
   * Emitted when a guild role is updated
   */
  roleUpdate: (oldRole: any | null, newRole: any) => void

  /**
   * Emitted when a guild role is deleted
   */
  roleDelete: (role: any) => void

  /**
   * Emitted when a channel is created
   */
  channelCreate: (channel: any) => void

  /**
   * Emitted when a channel is updated
   */
  channelUpdate: (oldChannel: any | null, newChannel: any) => void

  /**
   * Emitted when a channel is deleted
   */
  channelDelete: (channel: any) => void

  /**
   * Emitted when a user starts typing in a channel
   */
  typingStart: (typing: any) => void

  /**
   * Emitted when a user's presence is updated
   */
  presenceUpdate: (oldPresence: any | null, newPresence: any) => void

  /**
   * Emitted when a user is updated
   */
  userUpdate: (oldUser: any | null, newUser: any) => void

  /**
   * Emitted when a voice state is updated
   */
  voiceStateUpdate: (oldState: any | null, newState: any) => void

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
  rateLimit: (rateLimitInfo: any) => void

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
