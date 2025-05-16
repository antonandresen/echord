# WebSocket Implementation Plan

## Overview

The WebSocket client needs to handle:
1. Connection to Discord Gateway
2. Heartbeat management
3. Session resuming
4. Reconnection with exponential backoff
5. Proper event handling
6. Compression (optional)
7. Sharding (optional)

## Core Components

### WebSocketManager
```typescript
class WebSocketManager {
  // Properties
  private client: Client
  private ws: WebSocket | null
  private sequence: number | null
  private sessionId: string | null
  private resumeGatewayUrl: string | null
  private heartbeatInterval: number | null
  private lastHeartbeatAck: boolean
  private heartbeatTimer: NodeJS.Timeout | null
  private reconnectAttempts: number
  private closeSequence: number | null
  private expectingClose: boolean
  
  // Methods
  connect(): Promise<void>
  disconnect(code?: number, reason?: string): void
  destroy(): void
  private handleOpen(): void
  private handleClose(event: CloseEvent): void
  private handleError(error: Error): void
  private handleMessage(data: WebSocket.Data): void
  private identify(): void
  private resume(): void
  private startHeartbeat(interval: number): void
  private stopHeartbeat(): void
  private reconnect(): void
}
```

### WebSocketShard
```typescript
class WebSocketShard {
  id: number
  totalShards: number
  status: WebSocketStatus
  
  connect(): Promise<void>
  disconnect(): void
  send(data: unknown): void
  private handleReady(data: GatewayReadyDispatch): void
  private handleResumed(): void
  private handleInvalidSession(): void
}
```

## Connection Flow

1. **Initial Connection**
```typescript
async function connect() {
  const gateway = await this.client.rest.get('/gateway/bot')
  const ws = new WebSocket(`${gateway.url}?v=10&encoding=json`)
  
  ws.on('open', this.handleOpen)
  ws.on('close', this.handleClose)
  ws.on('error', this.handleError)
  ws.on('message', this.handleMessage)
}
```

2. **Identify Flow**
```typescript
function identify() {
  const payload: GatewayIdentifyData = {
    token: this.client.token,
    properties: {
      os: process.platform,
      browser: 'echord',
      device: 'echord'
    },
    intents: this.client.options.intents,
    compress: false,
    large_threshold: 250
  }
  
  this.send({
    op: GatewayOPCodes.IDENTIFY,
    d: payload
  })
}
```

3. **Resume Flow**
```typescript
function resume() {
  if (!this.sessionId || !this.sequence) {
    return this.identify()
  }
  
  const payload: GatewayResumeData = {
    token: this.client.token,
    session_id: this.sessionId,
    seq: this.sequence
  }
  
  this.send({
    op: GatewayOPCodes.RESUME,
    d: payload
  })
}
```

## Heartbeat Management

```typescript
class HeartbeatManager {
  private interval: number | null
  private lastAck: boolean
  private timer: NodeJS.Timeout | null
  private sequence: number | null
  
  constructor(ws: WebSocketManager) {
    this.ws = ws
  }
  
  start(interval: number) {
    this.interval = interval
    this.lastAck = true
    this.sendHeartbeat()
  }
  
  ack() {
    this.lastAck = true
  }
  
  private sendHeartbeat() {
    if (!this.lastAck) {
      return this.ws.destroy(4000, 'Zombied connection')
    }
    
    this.lastAck = false
    this.ws.send({
      op: GatewayOPCodes.HEARTBEAT,
      d: this.sequence
    })
    
    this.timer = setTimeout(() => this.sendHeartbeat(), this.interval)
  }
  
  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.interval = null
  }
}
```

## Reconnection Strategy

```typescript
class ReconnectionManager {
  private attempts: number
  private timeout: NodeJS.Timeout | null
  
  async reconnect() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    
    const delay = Math.min(1000 * 2**this.attempts, 30000)
    this.attempts++
    
    await new Promise(resolve => {
      this.timeout = setTimeout(resolve, delay)
    })
    
    return this.ws.connect()
  }
  
  reset() {
    this.attempts = 0
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}
```

## Event Handling

```typescript
class WebSocketEventHandler {
  private dispatch(event: string, data: unknown) {
    switch (event) {
      case 'READY':
        return this.handleReady(data as GatewayReadyDispatch)
      case 'RESUMED':
        return this.handleResumed()
      case 'GUILD_CREATE':
        return this.handleGuildCreate(data as GatewayGuildCreateDispatch)
      case 'MESSAGE_CREATE':
        return this.handleMessageCreate(data as GatewayMessageCreateDispatch)
      // ... handle all events
    }
  }
  
  private handleReady(data: GatewayReadyDispatch) {
    this.sessionId = data.session_id
    this.resumeGatewayUrl = data.resume_gateway_url
    this.expectingClose = false
    this.reconnectAttempts = 0
    this.client.emit('ready', this.client)
  }
  
  private handleResumed() {
    this.expectingClose = false
    this.reconnectAttempts = 0
    this.client.emit('resumed')
  }
}
```

## Compression (Optional)

```typescript
class CompressionManager {
  private inflate: zlib.Inflate
  private deflate: zlib.Deflate
  
  constructor() {
    this.inflate = zlib.createInflate()
    this.deflate = zlib.createDeflate()
  }
  
  async decompress(data: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      this.inflate.once('error', reject)
      
      const chunks: Buffer[] = []
      this.inflate.on('data', chunk => chunks.push(chunk))
      this.inflate.on('end', () => {
        resolve(Buffer.concat(chunks).toString())
      })
      
      this.inflate.write(data)
      this.inflate.end()
    })
  }
  
  async compress(data: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.deflate.once('error', reject)
      
      const chunks: Buffer[] = []
      this.deflate.on('data', chunk => chunks.push(chunk))
      this.deflate.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      
      this.deflate.write(data)
      this.deflate.end()
    })
  }
}
```

## Sharding (Optional)

```typescript
class ShardingManager {
  shards: Collection<number, WebSocketShard>
  totalShards: number
  
  constructor(client: Client, totalShards: number | 'auto') {
    this.client = client
    this.totalShards = totalShards === 'auto' ? 1 : totalShards
  }
  
  async spawn(id: number) {
    const shard = new WebSocketShard(this, id)
    this.shards.set(id, shard)
    await shard.connect()
    return shard
  }
  
  async spawnAll() {
    if (this.totalShards === 'auto') {
      const gateway = await this.client.rest.get('/gateway/bot')
      this.totalShards = gateway.shards
    }
    
    for (let i = 0; i < this.totalShards; i++) {
      await this.spawn(i)
    }
  }
}
```

## Implementation Notes

1. **Error Handling**
   - Proper error events for connection issues
   - Automatic reconnection with backoff
   - Session invalidation handling
   - Rate limit handling

2. **Performance**
   - Efficient event handling
   - Minimal memory usage
   - Proper cleanup on disconnect
   - Optional compression

3. **Debugging**
   - Debug mode with detailed logging
   - Connection status tracking
   - Performance metrics
   - Error tracking

4. **Testing**
   - Mock WebSocket server
   - Connection scenarios
   - Error scenarios
   - Event handling tests

5. **Documentation**
   - Clear usage examples
   - Error handling guide
   - Performance tips
   - Debugging guide 