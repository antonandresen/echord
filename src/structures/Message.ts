import type { Client } from '../client/Client'
import type { Snowflake } from '../types'
import { Base } from './Base'
import { User } from './User'

/**
 * Represents a message attachment
 */
export interface MessageAttachment {
  id: Snowflake
  filename: string
  description?: string
  contentType?: string
  size: number
  url: string
  proxyUrl: string
  height?: number
  width?: number
  ephemeral?: boolean
}

/**
 * Represents a message embed
 */
export interface MessageEmbed {
  title?: string
  type?: string
  description?: string
  url?: string
  timestamp?: string
  color?: number
  footer?: {
    text: string
    iconUrl?: string
    proxyIconUrl?: string
  }
  image?: {
    url: string
    proxyUrl?: string
    height?: number
    width?: number
  }
  thumbnail?: {
    url: string
    proxyUrl?: string
    height?: number
    width?: number
  }
  video?: {
    url?: string
    proxyUrl?: string
    height?: number
    width?: number
  }
  provider?: {
    name?: string
    url?: string
  }
  author?: {
    name: string
    url?: string
    iconUrl?: string
    proxyIconUrl?: string
  }
  fields?: {
    name: string
    value: string
    inline?: boolean
  }[]
}

/**
 * Represents a Discord message
 */
export class Message extends Base {
  public channelId: Snowflake
  public guildId: Snowflake | null
  public author: User
  public content: string
  public timestamp: Date
  public editedTimestamp: Date | null
  public tts: boolean
  public mentionEveryone: boolean
  public mentions: User[]
  public mentionRoles: Snowflake[]
  public attachments: MessageAttachment[]
  public embeds: MessageEmbed[]
  public reactions: {
    count: number
    me: boolean
    emoji: {
      id: Snowflake | null
      name: string
    }
  }[]
  public nonce?: string | number
  public pinned: boolean
  public webhookId?: Snowflake
  public type: number
  public activity?: {
    type: number
    partyId?: string
  }
  public application?: {
    id: Snowflake
    coverImage?: string
    description: string
    icon: string | null
    name: string
  }
  public applicationId?: Snowflake
  public messageReference?: {
    messageId?: Snowflake
    channelId?: Snowflake
    guildId?: Snowflake
  }
  public flags?: number
  public referencedMessage?: Message | null
  public interaction?: {
    id: Snowflake
    type: number
    name: string
    user: User
  }
  public thread?: any // Will be properly typed when implementing threads
  public components?: any[] // Will be properly typed when implementing components
  public stickers?: any[] // Will be properly typed when implementing stickers

  constructor(client: Client, data: any) {
    super(client, data.id)
    this.channelId = data.channel_id
    this.guildId = data.guild_id ?? null
    this.author = new User(client, data.author)
    this.content = data.content
    this.timestamp = new Date(data.timestamp)
    this.editedTimestamp = data.edited_timestamp
      ? new Date(data.edited_timestamp)
      : null
    this.tts = data.tts
    this.mentionEveryone = data.mention_everyone
    this.mentions = data.mentions.map(
      (mention: any) => new User(client, mention),
    )
    this.mentionRoles = data.mention_roles
    this.attachments = data.attachments
    this.embeds = data.embeds
    this.reactions = data.reactions ?? []
    this.nonce = data.nonce
    this.pinned = data.pinned
    this.webhookId = data.webhook_id
    this.type = data.type
    this.activity = data.activity
    this.application = data.application
    this.applicationId = data.application_id
    this.messageReference = data.message_reference
    this.flags = data.flags
    this.referencedMessage = data.referenced_message
      ? new Message(client, data.referenced_message)
      : null
    this.interaction = data.interaction
      ? {
        ...data.interaction,
        user: new User(client, data.interaction.user),
      }
      : undefined
    this.thread = data.thread
    this.components = data.components
    this.stickers = data.stickers
  }

  /**
   * Whether this message was sent by a webhook
   */
  public isWebhook(): boolean {
    return Boolean(this.webhookId)
  }

  /**
   * Whether this message is a system message
   */
  public isSystem(): boolean {
    return this.type !== 0
  }

  /**
   * Whether this message was sent by the client user
   */
  public isSelf(): boolean {
    return this.author.id === this.client.user?.id
  }

  /**
   * Whether this message mentions the client user
   */
  public mentionsMe(): boolean {
    return this.mentions.some((user) => user.id === this.client.user?.id)
  }

  /**
   * Whether this message is crossposted
   */
  public isCrossposted(): boolean {
    return Boolean(this.flags && (this.flags & 1) === 1)
  }

  /**
   * Whether this message is a source message for a crosspost
   */
  public isCrosspost(): boolean {
    return Boolean(this.flags && (this.flags & 2) === 2)
  }

  /**
   * Whether this message's embeds have been suppressed
   */
  public hasSupressedEmbeds(): boolean {
    return Boolean(this.flags && (this.flags & 4) === 4)
  }

  /**
   * Whether this message is a source message for a message reminder
   */
  public isSourceMessage(): boolean {
    return Boolean(this.flags && (this.flags & 8) === 8)
  }

  /**
   * Whether this message is urgent
   */
  public isUrgent(): boolean {
    return Boolean(this.flags && (this.flags & 16) === 16)
  }

  /**
   * Whether this message has been deleted
   */
  public isDeleted(): boolean {
    return Boolean(this.flags && (this.flags & 32) === 32)
  }

  /**
   * Whether this message is a failed to mention some roles and add their members to the thread
   */
  public hasFailedToMentionRoles(): boolean {
    return Boolean(this.flags && (this.flags & 64) === 64)
  }

  /**
   * Whether this message contains a link that was silently blocked
   */
  public hasBlockedLink(): boolean {
    return Boolean(this.flags && (this.flags & 128) === 128)
  }
}
