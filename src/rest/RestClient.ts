import fetch from 'node-fetch'
import type { Client } from '../client/Client'
import type {
  HTTPMethod,
  RequestOptions,
  RESTClientOptions,
  RESTResponse,
} from '../types/rest'

/**
 * REST client for making API requests
 */
export class RESTClient {
  private readonly baseURL: string
  private readonly version: number
  private readonly token: string

  constructor(client: Client, options: RESTClientOptions = {}) {
    this.baseURL = options.baseURL ?? 'https://discord.com/api'
    this.version = options.version ?? 10
    this.token = client.token ?? ''
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
    return await this.request<T>('GET', path, options)
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
    return await this.request<T>('POST', path, { ...options, body })
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
    return await this.request<T>('PUT', path, { ...options, body })
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
    return await this.request<T>('PATCH', path, { ...options, body })
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
    return await this.request<T>('DELETE', path, options)
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
      'User-Agent': 'echord (https://github.com/antonandresen/echord, 1.0.0)',
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (options.reason !== null && options.reason !== undefined && options.reason !== '') {
      headers['X-Audit-Log-Reason'] = options.reason
    }

    // Add authorization header if token is provided
    if (this.token !== null && this.token !== '') {
      headers.Authorization = `Bot ${this.token}`
    }

    const response = await fetch(url, {
      method,
      headers,
      body: options.body !== null && options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after')
      if (retryAfter !== null && retryAfter !== '') {
        const delay = parseInt(retryAfter, 10) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.request(method, path, options)
      }
    }

    // Handle global rate limiting
    const globalRateLimit = response.headers.get('x-ratelimit-global')
    if (globalRateLimit !== null && globalRateLimit === 'true') {
      const retryAfter = response.headers.get('retry-after')
      if (retryAfter !== null && retryAfter !== '') {
        const delay = parseInt(retryAfter, 10) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.request(method, path, options)
      }
    }

    if (response.status >= 400) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json') === true) {
      return response.json() as Promise<RESTResponse<T>>
    }

    return (await response.text()) as unknown as RESTResponse<T>
  }
}
