import { describe, expect, it } from '@jest/globals'
import { GatewayIntentBits } from '../types/gateway.js'

describe('Basic', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should import GatewayIntentBits', () => {
    expect(GatewayIntentBits.Guilds).toBeDefined()
    expect(GatewayIntentBits.GuildMessages).toBeDefined()
    expect(GatewayIntentBits.MessageContent).toBeDefined()
  })

  it('should have correct intent values', () => {
    expect(GatewayIntentBits.Guilds).toBe(1 << 0)
    expect(GatewayIntentBits.GuildMessages).toBe(1 << 9)
    expect(GatewayIntentBits.MessageContent).toBe(1 << 15)
  })
}) 