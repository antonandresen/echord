import { EventEmitter } from 'node:events'
import { platform } from 'node:process'
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
      os: platform,
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
      payload = JSON.parse(inflator.result as string) as GatewayPayload
    } else {
      payload = JSON.parse(data.toString()) as GatewayPayload
    }

    const { op, d, s, t } = payload

    if (s !== null && s !== undefined) this.sequence = s

    switch (op) {
      case GatewayOpCodes.Dispatch:
        if (t !== null && t !== undefined) this.handleDispatch(t, d)
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
        if (d !== null && d !== undefined && typeof d === 'object' && 'heartbeat_interval' in d) {
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
        if (this.isReadyData(data)) {
          this.sessionId = data.session_id
          this.resumeGatewayUrl = data.resume_gateway_url
        }
        break
      case GatewayDispatchEvents.Resumed:
        // Successfully resumed
        break
    }

    this.emit(event, data)
  }

  private isReadyData(data: unknown): data is { session_id: string; resume_gateway_url: string } {
    return (
      typeof data === 'object' &&
      data !== null &&
      'session_id' in data &&
      'resume_gateway_url' in data &&
      typeof (data as { session_id: unknown }).session_id === 'string' &&
      typeof (data as { resume_gateway_url: unknown }).resume_gateway_url === 'string'
    )
  }

  private onError(error: Error): void {
    this.emit('error', error)
  }

  private onClose(code: number, reason: string): void {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    this.emit('close', { code, reason })

    // Attempt to resume if we have the required data
    if (this.sessionId !== null && this.sessionId !== '' && this.sequence !== null && this.sequence !== 0) {
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
    if (this.ws === null || this.sessionId === null || this.sessionId === '' || this.sequence === null || this.sequence === 0) return

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
    if (this.ws === null) return

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

    if (this.resumeGatewayUrl !== null && this.resumeGatewayUrl !== '') {
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
