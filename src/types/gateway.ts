/**
 * Gateway opcodes used for communicating with Discord's WebSocket API
 * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
 */
export enum GatewayOpCodes {
  Dispatch = 0,
  Heartbeat = 1,
  Identify = 2,
  PresenceUpdate = 3,
  VoiceStateUpdate = 4,
  Resume = 6,
  Reconnect = 7,
  RequestGuildMembers = 8,
  InvalidSession = 9,
  Hello = 10,
  HeartbeatAck = 11,
}

/**
 * Gateway dispatch events received from Discord
 * @see https://discord.com/developers/docs/topics/gateway-events#receive-events
 */
export enum GatewayDispatchEvents {
  Ready = 'READY',
  Resumed = 'RESUMED',
  ApplicationCommandPermissionsUpdate = 'APPLICATION_COMMAND_PERMISSIONS_UPDATE',
  AutoModerationRuleCreate = 'AUTO_MODERATION_RULE_CREATE',
  AutoModerationRuleUpdate = 'AUTO_MODERATION_RULE_UPDATE',
  AutoModerationRuleDelete = 'AUTO_MODERATION_RULE_DELETE',
  AutoModerationActionExecution = 'AUTO_MODERATION_ACTION_EXECUTION',
  ChannelCreate = 'CHANNEL_CREATE',
  ChannelUpdate = 'CHANNEL_UPDATE',
  ChannelDelete = 'CHANNEL_DELETE',
  ChannelPinsUpdate = 'CHANNEL_PINS_UPDATE',
  ThreadCreate = 'THREAD_CREATE',
  ThreadUpdate = 'THREAD_UPDATE',
  ThreadDelete = 'THREAD_DELETE',
  ThreadListSync = 'THREAD_LIST_SYNC',
  ThreadMemberUpdate = 'THREAD_MEMBER_UPDATE',
  ThreadMembersUpdate = 'THREAD_MEMBERS_UPDATE',
  GuildCreate = 'GUILD_CREATE',
  GuildUpdate = 'GUILD_UPDATE',
  GuildDelete = 'GUILD_DELETE',
  GuildBanAdd = 'GUILD_BAN_ADD',
  GuildBanRemove = 'GUILD_BAN_REMOVE',
  GuildEmojisUpdate = 'GUILD_EMOJIS_UPDATE',
  GuildStickersUpdate = 'GUILD_STICKERS_UPDATE',
  GuildIntegrationsUpdate = 'GUILD_INTEGRATIONS_UPDATE',
  GuildMemberAdd = 'GUILD_MEMBER_ADD',
  GuildMemberRemove = 'GUILD_MEMBER_REMOVE',
  GuildMemberUpdate = 'GUILD_MEMBER_UPDATE',
  GuildMembersChunk = 'GUILD_MEMBERS_CHUNK',
  GuildRoleCreate = 'GUILD_ROLE_CREATE',
  GuildRoleUpdate = 'GUILD_ROLE_UPDATE',
  GuildRoleDelete = 'GUILD_ROLE_DELETE',
  GuildScheduledEventCreate = 'GUILD_SCHEDULED_EVENT_CREATE',
  GuildScheduledEventUpdate = 'GUILD_SCHEDULED_EVENT_UPDATE',
  GuildScheduledEventDelete = 'GUILD_SCHEDULED_EVENT_DELETE',
  GuildScheduledEventUserAdd = 'GUILD_SCHEDULED_EVENT_USER_ADD',
  GuildScheduledEventUserRemove = 'GUILD_SCHEDULED_EVENT_USER_REMOVE',
  IntegrationCreate = 'INTEGRATION_CREATE',
  IntegrationUpdate = 'INTEGRATION_UPDATE',
  IntegrationDelete = 'INTEGRATION_DELETE',
  InteractionCreate = 'INTERACTION_CREATE',
  InviteCreate = 'INVITE_CREATE',
  InviteDelete = 'INVITE_DELETE',
  MessageCreate = 'MESSAGE_CREATE',
  MessageUpdate = 'MESSAGE_UPDATE',
  MessageDelete = 'MESSAGE_DELETE',
  MessageDeleteBulk = 'MESSAGE_DELETE_BULK',
  MessageReactionAdd = 'MESSAGE_REACTION_ADD',
  MessageReactionRemove = 'MESSAGE_REACTION_REMOVE',
  MessageReactionRemoveAll = 'MESSAGE_REACTION_REMOVE_ALL',
  MessageReactionRemoveEmoji = 'MESSAGE_REACTION_REMOVE_EMOJI',
  PresenceUpdate = 'PRESENCE_UPDATE',
  StageInstanceCreate = 'STAGE_INSTANCE_CREATE',
  StageInstanceUpdate = 'STAGE_INSTANCE_UPDATE',
  StageInstanceDelete = 'STAGE_INSTANCE_DELETE',
  TypingStart = 'TYPING_START',
  UserUpdate = 'USER_UPDATE',
  VoiceStateUpdate = 'VOICE_STATE_UPDATE',
  VoiceServerUpdate = 'VOICE_SERVER_UPDATE',
  WebhooksUpdate = 'WEBHOOKS_UPDATE',
}

/**
 * Gateway intents required for receiving specific events
 * @see https://discord.com/developers/docs/topics/gateway#gateway-intents
 */
export enum GatewayIntentBits {
  Guilds = 1 << 0,
  GuildMembers = 1 << 1,
  GuildModeration = 1 << 2,
  GuildEmojisAndStickers = 1 << 3,
  GuildIntegrations = 1 << 4,
  GuildWebhooks = 1 << 5,
  GuildInvites = 1 << 6,
  GuildVoiceStates = 1 << 7,
  GuildPresences = 1 << 8,
  GuildMessages = 1 << 9,
  GuildMessageReactions = 1 << 10,
  GuildMessageTyping = 1 << 11,
  DirectMessages = 1 << 12,
  DirectMessageReactions = 1 << 13,
  DirectMessageTyping = 1 << 14,
  MessageContent = 1 << 15,
  GuildScheduledEvents = 1 << 16,
  AutoModerationConfiguration = 1 << 20,
  AutoModerationExecution = 1 << 21,
}

/**
 * Gateway close event codes
 * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes
 */
export enum GatewayCloseCodes {
  UnknownError = 4000,
  UnknownOpcode = 4001,
  DecodeError = 4002,
  NotAuthenticated = 4003,
  AuthenticationFailed = 4004,
  AlreadyAuthenticated = 4005,
  InvalidSeq = 4007,
  RateLimited = 4008,
  SessionTimedOut = 4009,
  InvalidShard = 4010,
  ShardingRequired = 4011,
  InvalidAPIVersion = 4012,
  InvalidIntents = 4013,
  DisallowedIntents = 4014,
}

export interface GatewayPayload {
  op: GatewayOpCodes;
  d?: unknown;
  s?: number | null;
  t?: string | null;
}

export interface GatewayIdentifyData {
  token: string
  properties: {
    os: string
    browser: string
    device: string
  }
  intents: number
  compress?: boolean
  large_threshold?: number
  shard?: [number, number]
  presence?: GatewayPresenceUpdateData
}

export interface GatewayPresenceUpdateData {
  since: number | null
  activities: Array<{
    name: string
    type: number
    url?: string
  }>
  status: 'online' | 'dnd' | 'idle' | 'invisible' | 'offline'
  afk: boolean
}

export interface GatewayHelloData {
  heartbeat_interval: number
}
