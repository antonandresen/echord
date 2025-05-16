export interface User {
  id: string
  username: string
  discriminator: string
  bot?: boolean
  system?: boolean
  flags?: number
}

export interface Guild {
  id: string
  name: string
  icon?: string
  owner_id: string
  permissions?: string
  features: string[]
}

export interface GuildMember {
  user?: User
  nick?: string
  roles: string[]
  joined_at: string
  deaf: boolean
  mute: boolean
  guild_id: string
  pending?: boolean
  permissions?: string
}

export interface Channel {
  id: string
  type: number
  guild_id?: string
  name?: string
  topic?: string
  nsfw?: boolean
  last_message_id?: string
  rate_limit_per_user?: number
  parent_id?: string
}

export interface Message {
  id: string
  channel_id: string
  author: User
  content: string
  timestamp: string
  edited_timestamp: string | null
  tts: boolean
  mention_everyone: boolean
  mentions: User[]
  mention_roles: string[]
  attachments: Array<{
    id: string
    filename: string
    size: number
    url: string
    proxy_url: string
  }>
  embeds: Array<{
    title?: string
    type?: string
    description?: string
    url?: string
    timestamp?: string
    color?: number
    footer?: {
      text: string
      icon_url?: string
    }
    image?: {
      url: string
      proxy_url?: string
      height?: number
      width?: number
    }
    thumbnail?: {
      url: string
      proxy_url?: string
      height?: number
      width?: number
    }
    author?: {
      name: string
      url?: string
      icon_url?: string
    }
    fields?: Array<{
      name: string
      value: string
      inline?: boolean
    }>
  }>
  reactions?: Array<{
    count: number
    me: boolean
    emoji: {
      id: string | null
      name: string
    }
  }>
  pinned: boolean
  type: number
  member?: GuildMember
  guild_id?: string
  channel: Channel
}
