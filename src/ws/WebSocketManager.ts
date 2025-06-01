import { GatewayClient } from '../gateway/GatewayClient'
import type { Client } from '../client/Client'

/**
 * Manages WebSocket connections for the client
 */
export class WebSocketManager {
  private readonly client: Client
  private gateway: GatewayClient | null = null

  constructor(client: Client) {
    this.client = client
  }

  /**
   * Connect to the Discord gateway
   */
  public async connect(): Promise<void> {
    if (this.client.token === null || this.client.token === undefined || this.client.token === '') {
      throw new Error('No token provided')
    }

    this.gateway = new GatewayClient({
      token: this.client.token,
      intents: this.client.options.intents,
    })

    return new Promise((resolve, reject) => {
      if (!this.gateway) return reject(new Error('Gateway not initialized'))

      this.gateway.once('ready', () => {
        this.client.isReady = true
        this.client.readyTimestamp = Date.now()
        resolve()
      })

      this.gateway.once('error', reject)
      this.gateway.connect()
    })
  }

  /**
   * Destroy the WebSocket connection
   */
  public destroy(): void {
    if (this.gateway) {
      this.gateway.destroy()
      this.gateway = null
    }
  }
}
