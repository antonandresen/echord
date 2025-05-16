import fetch from 'node-fetch'
import type { Client } from '../client/Client'
import type {
  HTTPMethod,
  RateLimitData,
  RequestOptions,
  RESTClientOptions,
  RESTResponse,
} from '../types/rest'
import { RequestQueue } from './RequestQueue.js'

/**
 * REST client for making API requests
 */
export class RESTClient {
  private readonly client: Client
  private readonly baseURL: string
  private readonly version: number
  private readonly token: string
  private readonly apiBase = 'https://discord.com/api/v10'
  private readonly queues = new Map<string, RequestQueue>()
  private globalQueue: RequestQueue | null = null

  constructor(client: Client, options: RESTClientOptions = {}) {
    this.client = client
    this.baseURL = options.baseURL ?? 'https://discord.com/api'
    this.version = options.version ?? 10
    this.token = client.token
  }

  /**
   * Make a GET request
   * @param path The path to request
   * @param options Request options
   */
  public async get<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<RESTResponse<T>> {
    return this.request<T>('GET', path, options)
  }

  /**
   * Make a POST request
   * @param path The path to request
   * @param body The request body
   * @param options Request options
   */
  public async post<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<RESTResponse<T>> {
    return this.request<T>('POST', path, { ...options, body })
  }

  /**
   * Make a PUT request
   * @param path The path to request
   * @param body The request body
   * @param options Request options
   */
  public async put<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<RESTResponse<T>> {
    return this.request<T>('PUT', path, { ...options, body })
  }

  /**
   * Make a PATCH request
   * @param path The path to request
   * @param body The request body
   * @param options Request options
   */
  public async patch<T>(
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<RESTResponse<T>> {
    return this.request<T>('PATCH', path, { ...options, body })
  }

  /**
   * Make a DELETE request
   * @param path The path to request
   * @param options Request options
   */
  public async delete<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<RESTResponse<T>> {
    return this.request<T>('DELETE', path, options)
  }

  /**
   * Make a request to the Discord API
   * @param method The HTTP method
   * @param path The path to request
   * @param options Request options
   */
  private async request<T>(
    method: HTTPMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<RESTResponse<T>> {
    const url = `${this.baseURL}/v${this.version}${path}`
    const headers: Record<string, string> = {
      Authorization: `Bot ${this.token}`,
      'User-Agent': 'echord (https://github.com/antonandresen/echord, 1.0.0)',
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (options.reason) {
      headers['X-Audit-Log-Reason'] = options.reason
    }

    const response = await fetch(url, {
      method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      if (response.status === 429) {
        const data = (await response.json()) as RateLimitData
        throw new Error(`Rate limited: Retry after ${data.retry_after} seconds`)
      }
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return response.json() as Promise<RESTResponse<T>>
    }

    return response.text() as RESTResponse<T>
  }

  /**
   * Helper method to GET from an endpoint
   */
  public get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint)
  }

  /**
   * Helper method to POST to an endpoint
   */
  public post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, body)
  }

  /**
   * Helper method to PUT to an endpoint
   */
  public put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', endpoint, body)
  }

  /**
   * Helper method to PATCH an endpoint
   */
  public patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>('PATCH', endpoint, body)
  }

  /**
   * Helper method to DELETE from an endpoint
   */
  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint)
  }

  /**
   * Get or create a queue for a bucket
   */
  private getQueue(bucket: string, limit: number): RequestQueue {
    let queue = this.queues.get(bucket)
    if (!queue) {
      queue = new RequestQueue(bucket, limit)
      this.queues.set(bucket, queue)
    }
    return queue
  }

  /**
   * Get the bucket for an endpoint by making a dummy request
   */
  private async getBucket(
    method: string,
    endpoint: string,
  ): Promise<string | null> {
    try {
      const url = `${this.apiBase}${endpoint}`
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bot ${this.token}`,
        },
      })

      const bucket = response.headers.get('x-ratelimit-bucket')
      return bucket
    } catch {
      return null
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

/**
 * REST client options
 */
interface RESTClientOptions {
  baseURL?: string
  version?: number
}

/**
 * Request options
 */
interface RequestOptions {
  headers?: Record<string, string>
  reason?: string
  body?: unknown
}
