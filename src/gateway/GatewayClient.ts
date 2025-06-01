import { EventEmitter } from 'node:events'
import process from 'node:process'
import { WebSocket } from 'ws'
import { Inflate } from 'zlib-sync'
import {
  GatewayDispatchEvents,
  GatewayOpCodes,
  type GatewayPayload,
} from '../types/gateway'
import type { Buffer } from 'node:buffer'

export interface GatewayClientOptions {
  token: string
  intents: number
  compress?: boolean
  properties?: {
    os: string
    browser: string
    device: string
  }
}

export class GatewayClient extends EventEmitter {
  private ws: WebSocket | null = null
  private sequence: number | null = null
  private sessionId: string | null = null
  private heartbeatInterval: NodeJS.Timeout | null = null
  private lastHeartbeatAck: boolean = false
  private resumeGatewayUrl: string | null = null

  private readonly token: string
  private readonly intents: number
  private readonly compress: boolean
  private readonly properties: {
    os: string
    browser: string
    device: string
  }

  constructor(options: GatewayClientOptions) {
    super()
    this.token = options.token
    this.intents = options.intents
    this.compress = options.compress ?? true
    this.properties = options.properties ?? {
      os: process.platform,
      browser: 'echord',
      device: 'echord',
    }
  }

  public connect(url: string = 'wss://gateway.discord.gg'): void {
    this.ws = new WebSocket(
      `${url}/?v=10&encoding=json${this.compress ? '&compress=zlib-stream' : ''}`,
    )

    this.ws.on('open', this.onOpen.bind(this))
    this.ws.on('message', this.onMessage.bind(this))
    this.ws.on('error', this.onError.bind(this))
    this.ws.on('close', this.onClose.bind(this))
  }

  private onOpen(): void {
    this.lastHeartbeatAck = true
    this.identify()
  }

  private onMessage(data: Buffer): void {
    let payload: GatewayPayload

    if (this.compress) {
      const inflator = new Inflate()
      inflator.push(data, true)
      payload = JSON.parse(inflator.result as string)
    } else {
      payload = JSON.parse(data.toString())
    }

    const { op, d, s, t } = payload

    if (s) this.sequence = s

    switch (op) {
      case GatewayOpCodes.Dispatch:
        if (t) this.handleDispatch(t, d)
        break
      case GatewayOpCodes.Heartbeat:
        this.sendHeartbeat()
        break
      case GatewayOpCodes.Reconnect:
        this.reconnect()
        break
      case GatewayOpCodes.InvalidSession:
        setTimeout(() => {
          this.identify()
        }, 5000)
        break
      case GatewayOpCodes.Hello:
        if (d && typeof d === 'object' && 'heartbeat_interval' in d) {
          this.startHeartbeat(d.heartbeat_interval as number)
        }
        break
      case GatewayOpCodes.HeartbeatAck:
        this.lastHeartbeatAck = true
        break
    }
  }

  private handleDispatch(event: string, data: unknown): void {
    switch (event) {
      case GatewayDispatchEvents.Ready:
        if (
          typeof data === 'object' &&
          data &&
          'session_id' in data &&
          'resume_gateway_url' in data
        ) {
          this.sessionId = data.session_id as string
          this.resumeGatewayUrl = data.resume_gateway_url as string
        }
        break
      case GatewayDispatchEvents.Resumed:
        // Successfully resumed
        break
    }

    this.emit(event, data)
  }

  private onError(error: Error): void {
    this.emit('error', error)
  }

  private onClose(code: number, reason: string): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    this.emit('close', { code, reason })

    // Attempt to resume if we have the required data
    if (this.sessionId && this.sequence) {
      this.resume()
    } else {
      // Otherwise reconnect with a new session
      setTimeout(() => {
        this.connect()
      }, 5000)
    }
  }

  private identify(): void {
    if (!this.ws) return

    const payload: GatewayPayload = {
      op: GatewayOpCodes.Identify,
      d: {
        token: this.token,
        intents: this.intents,
        properties: this.properties,
        compress: this.compress,
      },
    }

    this.ws.send(JSON.stringify(payload))
  }

  private resume(): void {
    if (!this.ws || !this.sessionId || !this.sequence) return

    const payload: GatewayPayload = {
      op: GatewayOpCodes.Resume,
      d: {
        token: this.token,
        session_id: this.sessionId,
        seq: this.sequence,
      },
    }

    this.ws.send(JSON.stringify(payload))
  }

  private startHeartbeat(interval: number): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    this.heartbeatInterval = setInterval(() => {
      if (!this.lastHeartbeatAck) {
        // Zombie connection - reconnect
        this.reconnect()
        return
      }

      this.sendHeartbeat()
      this.lastHeartbeatAck = false
    }, interval)

    // Send first heartbeat
    this.sendHeartbeat()
  }

  private sendHeartbeat(): void {
    if (!this.ws) return

    const payload: GatewayPayload = {
      op: GatewayOpCodes.Heartbeat,
      d: this.sequence,
    }

    this.ws.send(JSON.stringify(payload))
  }

  private reconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.resumeGatewayUrl) {
      this.connect(this.resumeGatewayUrl)
    } else {
      this.connect()
    }
  }

  public destroy(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.ws) {
      this.ws.close(1000)
      this.ws = null
    }

    this.sequence = null
    this.sessionId = null
    this.lastHeartbeatAck = false
    this.resumeGatewayUrl = null
  }
}
