import type { Client } from '../client/Client'
import type { Snowflake, MessageData } from '../types/structures'
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
  public thread?: unknown // Will be properly typed when implementing threads
  public components?: unknown[] // Will be properly typed when implementing components
  public stickers?: unknown[] // Will be properly typed when implementing stickers

  constructor(client: Client, data: MessageData) {
    super(client, data.id)
    this.channelId = data.channel_id
    this.guildId = data.guild_id ?? null
    this.author = new User(client, data.author)
    this.content = data.content
    this.timestamp = new Date(data.timestamp)
    this.editedTimestamp = data.edited_timestamp !== null && data.edited_timestamp !== undefined
      ? new Date(data.edited_timestamp)
      : null
    this.tts = data.tts
    this.mentionEveryone = data.mention_everyone
    this.mentions = data.mentions.map(
      (mention) => new User(client, mention),
    )
    this.mentionRoles = data.mention_roles
    this.attachments = data.attachments.map(attachment => ({
      ...attachment,
      proxyUrl: attachment.proxy_url,
      contentType: attachment.content_type,
    }))
    this.embeds = data.embeds
    this.reactions = data.reactions ?? []
    this.nonce = data.nonce
    this.pinned = data.pinned
    this.webhookId = data.webhook_id
    this.type = data.type
    this.activity = data.activity
    this.application = data.application !== null && data.application !== undefined ? {
      id: data.application.id,
      coverImage: data.application.cover_image,
      description: data.application.description,
      icon: data.application.icon ?? null,
      name: data.application.name,
    } : undefined
    this.applicationId = data.application_id
    this.messageReference = data.message_reference ? {
      messageId: data.message_reference.message_id,
      channelId: data.message_reference.channel_id,
      guildId: data.message_reference.guild_id,
    } : undefined
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
    this.stickers = data.sticker_items
  }

  /**
   * Whether this message was sent by a webhook
   */
  public isWebhook(): boolean {
    return this.webhookId !== undefined
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
    return typeof this.client.user === 'string' && this.author.id === this.client.user
  }

  /**
   * Whether this message mentions the client user
   */
  public mentionsMe(): boolean {
    return typeof this.client.user === 'string' && this.mentions.some((user) => user.id === this.client.user)
  }

  /**
   * Whether this message is crossposted
   */
  public isCrossposted(): boolean {
    return this.flags !== null && this.flags !== undefined && (this.flags & 1) === 1
  }

  /**
   * Whether this message is a source message for a crosspost
   */
  public isCrosspost(): boolean {
    return this.flags !== null && this.flags !== undefined && (this.flags & 2) === 2
  }

  /**
   * Whether this message's embeds have been suppressed
   */
  public hasSupressedEmbeds(): boolean {
    return this.flags !== null && this.flags !== undefined && (this.flags & 4) === 4
  }

  /**
   * Whether this message is a source message for a message reminder
   */
  public isSourceMessage(): boolean {
    return this.flags !== null && this.flags !== undefined && (this.flags & 8) === 8
  }

  /**
   * Whether this message is urgent
   */
  public isUrgent(): boolean {
    return this.flags !== null && this.flags !== undefined && (this.flags & 16) === 16
  }

  /**
   * Whether this message has been deleted
   */
  public isDeleted(): boolean {
    return this.flags !== null && this.flags !== undefined && (this.flags & 32) === 32
  }

  /**
   * Whether this message is a failed to mention some roles and add their members to the thread
   */
  public hasFailedToMentionRoles(): boolean {
    return this.flags !== null && this.flags !== undefined && (this.flags & 64) === 64
  }

  /**
   * Whether this message contains a link that was silently blocked
   */
  public hasBlockedLink(): boolean {
    return this.flags !== null && this.flags !== undefined && (this.flags & 128) === 128
  }
}
