import type { Client } from '../client/Client'
import type { Snowflake } from '../types'

/**
 * The base class that all structures extend
 */
export class Base {
  /**
   * The client that instantiated this
   */
  public readonly client: Client

  /**
   * The ID of the structure
   */
  public readonly id: Snowflake

  /**
   * The timestamp the structure was created at
   */
  public readonly createdAt: Date

  /**
   * The timestamp the structure was created at as a number
   */
  public readonly createdTimestamp: number

  constructor(client: Client, id: Snowflake) {
    this.client = client
    this.id = id
    this.createdTimestamp = Base.decodeSnowflake(id)
    this.createdAt = new Date(this.createdTimestamp)
  }

  /**
   * Decodes a Discord snowflake ID into a timestamp
   * @param snowflake The snowflake to decode
   */
  public static decodeSnowflake(snowflake: Snowflake): number {
    return Number(BigInt(snowflake) >> BigInt(22)) + 1420070400000
  }

  /**
   * Returns a string representation of this structure
   */
  public toString(): string {
    return this.id
  }

  /**
   * Whether this structure equals another
   * @param other The structure to compare with
   */
  public equals(other: Base): boolean {
    return other instanceof this.constructor && other.id === this.id
  }

  /**
   * Returns a JSON representation of this structure.
   */
  public toJSON(): { id: string } {
    return { id: this.id }
  }

  /**
   * Used to check if this structure equals another
   */
  public valueOf(): string {
    return this.id
  }
}
