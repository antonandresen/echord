import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import fetch, { type Response } from 'node-fetch'
import { WebSocket } from 'ws'
import { Client, GatewayIntents } from '../index.js'

// Mock WebSocket and fetch
jest.mock('ws')
jest.mock('node-fetch')

describe('Discord Client', () => {
  let client: Client
  let mockWs: jest.Mocked<WebSocket>

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()

    // Create mock WebSocket instance
    mockWs = {
      on: jest.fn().mockReturnThis(),
      once: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      close: jest.fn().mockReturnThis(),
      removeAllListeners: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<WebSocket>
      ; (WebSocket as unknown as jest.Mock).mockImplementation(() => mockWs)

    // Create a new client instance
    client = new Client('fake-token', {
      intents: Client.createIntents(
        GatewayIntents.Guilds,
        GatewayIntents.GuildMessages,
      ),
    })
  })

  describe('login', () => {
    it('should connect to the gateway successfully', async () => {
      // Simulate successful connection
      mockWs.once.mockImplementationOnce((event: string, cb: Function) => {
        if (event === 'open') {
          cb()
        }
        return mockWs
      })

      // Attempt to login
      await client.login()

      // Verify WebSocket was created
      expect(WebSocket).toHaveBeenCalledWith(
        expect.stringContaining('wss://gateway.discord.gg'),
      )

      // Verify event listeners were set up
      expect(mockWs.on).toHaveBeenCalledWith('message', expect.any(Function))
      expect(mockWs.on).toHaveBeenCalledWith('error', expect.any(Function))
      expect(mockWs.on).toHaveBeenCalledWith('close', expect.any(Function))
    })

    it('should handle connection errors', async () => {
      // Simulate connection error
      const error = new Error('Connection failed')
      mockWs.once.mockImplementationOnce((event: string, cb: Function) => {
        if (event === 'error') {
          cb(error)
        }
        return mockWs
      })

      // Attempt to login and expect it to fail
      await expect(client.login()).rejects.toThrow('Connection failed')
    })
  })

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const channelId = '123456789'
      const content = 'Test message'
      const mockResponse: Response = {
        ok: true,
        json: () =>
          Promise.resolve({
            id: '987654321',
            content,
            channel_id: channelId,
          }),
      } as Response

        ; (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
          mockResponse,
        )

      const message = await client.sendMessage(channelId, content)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/channels/${channelId}/messages`),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bot fake-token',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ content }),
        }),
      )

      expect(message).toEqual(
        expect.objectContaining({
          id: '987654321',
          content,
          channel_id: channelId,
        }),
      )
    })

    it('should handle API errors when sending messages', async () => {
      const channelId = '123456789'
      const content = 'Test message'
      const mockResponse: Response = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      } as Response

        ; (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
          mockResponse,
        )

      await expect(client.sendMessage(channelId, content)).rejects.toThrow(
        'Failed to send message: 403 Forbidden',
      )
    })
  })
})
