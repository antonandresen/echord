/**
 * REST client options
 */
export interface RESTClientOptions {
  baseURL?: string
  version?: number
}

/**
 * Request options
 */
export interface RequestOptions {
  headers?: Record<string, string>
  reason?: string
  body?: unknown
}

/**
 * Rate limit data from Discord
 */
export interface RateLimitData {
  message: string
  retry_after: number
  global: boolean
}

/**
 * HTTP methods supported by the REST client
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Response types for different endpoints
 */
export type RESTResponse<T> = T extends object ? T : string

/**
 * Request handler function type
 */
export type RequestHandler = <T>(
  method: HTTPMethod,
  path: string,
  options?: RequestOptions,
) => Promise<T>
