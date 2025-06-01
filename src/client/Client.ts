import { EventEmitter } from 'node:events'
import { ChannelManager } from '../managers/ChannelManager'
import { GuildManager } from '../managers/GuildManager'
import { UserManager } from '../managers/UserManager'
import { RESTClient } from '../rest/RestClient'
import { WebSocketManager } from '../ws/WebSocketManager'
import type { Snowflake } from '../types'
import type { ClientOptions } from '../types/client'

/**
 * The main hub for interacting with the Discord API
 */
export class Client extends EventEmitter {
  /**
   * The options the client was instantiated with
   */
  public readonly options: Required<ClientOptions>

  /**
   * The WebSocket manager of the client
   */
  public readonly ws: WebSocketManager

  /**
   * The REST API manager of the client
   */
  public readonly rest: RESTClient

  /**
   * The manager that holds all guilds
   */
  public readonly guilds: GuildManager

  /**
   * The manager that holds all channels
   */
  public readonly channels: ChannelManager

  /**
   * The manager that holds all users
   */
  public readonly users: UserManager

  /**
   * The token used to authenticate API requests
   */
  public token: string | null = null

  /**
   * The time the client became ready
   */
  public readyTimestamp: number | null = null

  /**
   * The ID of the client user
   */
  public user: Snowflake | null = null

  /**
   * Whether the client is ready to start working
   */
  public isReady = false

  constructor(options: ClientOptions = {}) {
    super()

    this.options = {
      intents: 0,
      shards: 'auto',
      shardCount: 1,
      closeTimeout: 5_000,
      retryLimit: 5,
      ...options,
    }

    this.ws = new WebSocketManager(this)
    this.rest = new RESTClient(this)
    this.guilds = new GuildManager(this)
    this.channels = new ChannelManager(this)
    this.users = new UserManager(this)
  }

  /**
   * The time the client became ready
   */
  public get readyAt(): Date | null {
    return this.readyTimestamp ? new Date(this.readyTimestamp) : null
  }

  /**
   * How long the client has been ready for in milliseconds
   */
  public get uptime(): number | null {
    return this.readyTimestamp ? Date.now() - this.readyTimestamp : null
  }

  /**
   * Logs the client in, establishing a WebSocket connection to Discord
   * @param token Token of the account to log in with
   */
  public async login(token: string): Promise<string> {
    if (!token || typeof token !== 'string') {
      throw new Error('TOKEN_INVALID')
    }

    this.token = token

    try {
      await this.ws.connect()
      return this.token
    } catch (error) {
      await this.destroy()
      throw error
    }
  }

  /**
   * Logs out, terminates the connection to Discord, and destroys the client
   */
  public async destroy(): Promise<void> {
    await this.ws.destroy()
    this.token = null
    this.user = null
    this.readyTimestamp = null
    this.isReady = false
  }

  /**
   * Obtains the OAuth Application of this bot from Discord
   */
  public async fetchApplication() {
    return await this.rest.get('/oauth2/applications/@me')
  }

  /**
   * Generates a link that can be used to invite the bot to a guild
   * @param permissions The permissions to request
   */
  public generateInvite(permissions = '0'): string {
    if (!this.user) {
      throw new Error('CLIENT_NOT_READY')
    }

    const query = new URLSearchParams({
      client_id: this.user,
      scope: 'bot applications.commands',
      permissions,
    })

    return `https://discord.com/oauth2/authorize?${query}`
  }
}
