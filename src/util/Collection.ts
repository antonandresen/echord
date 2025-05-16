/**
 * A Map with additional utility methods
 */
export class Collection<K, V> extends Map<K, V> {
  /**
   * Creates a new Collection
   * @param entries Entries to initialize with
   */
  constructor(entries?: readonly (readonly [K, V])[]) {
    super(entries ?? [])
  }

  /**
   * Returns the first value(s) that matches the filter
   * @param fn The function to test with (should return boolean)
   * @param count The number of values to get
   */
  public find<T extends V>(fn: (value: V, key: K, collection: this) => value is T): T | undefined
  public find(fn: (value: V, key: K, collection: this) => boolean): V | undefined
  public find<T extends V>(fn: (value: V, key: K, collection: this) => value is T, count: number): T[]
  public find(fn: (value: V, key: K, collection: this) => boolean, count: number): V[]
  public find(fn: (value: V, key: K, collection: this) => boolean, count?: number): V | V[] | undefined {
    if (typeof count === 'undefined') {
      for (const [key, val] of this) {
        if (fn(val, key, this)) return val
      }
      return undefined
    }

    if (count === 0) return []
    const values: V[] = []
    for (const [key, val] of this) {
      if (fn(val, key, this)) {
        values.push(val)
        if (values.length >= count) break
      }
    }
    return values
  }

  /**
   * Returns all values that match the filter
   * @param fn The function to test with (should return boolean)
   */
  public filter<T extends V>(fn: (value: V, key: K, collection: this) => value is T): Collection<K, T>
  public filter(fn: (value: V, key: K, collection: this) => boolean): Collection<K, V>
  public filter<T extends V>(fn: (value: V, key: K, collection: this) => boolean): Collection<K, V> {
    const results = new Collection<K, V>()
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val)
    }
    return results
  }

  /**
   * Maps each value to another value into an array
   * @param fn Function that produces an element of the new array
   */
  public map<T>(fn: (value: V, key: K, collection: this) => T): T[] {
    const results: T[] = []
    for (const [key, val] of this) {
      results.push(fn(val, key, this))
    }
    return results
  }

  /**
   * Maps each value to another value into a collection
   * @param fn Function that produces an element of the new collection
   */
  public mapValues<T>(fn: (value: V, key: K, collection: this) => T): Collection<K, T> {
    const results = new Collection<K, T>()
    for (const [key, val] of this) {
      results.set(key, fn(val, key, this))
    }
    return results
  }

  /**
   * Checks if there exists an element that passes a test
   * @param fn Function used to test (should return boolean)
   */
  public some(fn: (value: V, key: K, collection: this) => boolean): boolean {
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true
    }
    return false
  }

  /**
   * Checks if all elements pass a test
   * @param fn Function used to test (should return boolean)
   */
  public every(fn: (value: V, key: K, collection: this) => boolean): boolean {
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false
    }
    return true
  }

  /**
   * Applies a function to produce a single value
   * @param fn Function used to reduce (should return the new accumulator)
   * @param initialValue Starting value for the accumulator
   */
  public reduce<T>(fn: (accumulator: T, value: V, key: K, collection: this) => T, initialValue: T): T {
    let accumulator = initialValue
    for (const [key, val] of this) {
      accumulator = fn(accumulator, val, key, this)
    }
    return accumulator
  }

  /**
   * Returns random values from the collection
   * @param amount Amount of values to get
   */
  public random(): V | undefined
  public random(amount: number): V[]
  public random(amount?: number): V | V[] | undefined {
    const arr = [...this.values()]
    if (typeof amount === 'undefined') {
      if (!arr.length) return undefined
      return arr[Math.floor(Math.random() * arr.length)]
    }
    if (!arr.length) return []
    return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0])
  }

  /**
   * Returns the first value(s) in the collection
   * @param amount Amount of values to get
   */
  public first(): V | undefined
  public first(amount: number): V[]
  public first(amount?: number): V | V[] | undefined {
    if (typeof amount === 'undefined') {
      const first = this.values().next()
      return first.done ? undefined : first.value
    }
    if (amount < 0) return this.last(amount * -1)
    amount = Math.min(this.size, amount)
    const iter = this.values()
    return Array.from({ length: amount }, () => {
      const val = iter.next()
      return val.done ? undefined : val.value
    }).filter((val): val is V => val !== undefined)
  }

  /**
   * Returns the last value(s) in the collection
   * @param amount Amount of values to get
   */
  public last(): V | undefined
  public last(amount: number): V[]
  public last(amount?: number): V | V[] | undefined {
    const arr = [...this.values()]
    if (typeof amount === 'undefined') return arr[arr.length - 1]
    if (amount < 0) return this.first(amount * -1)
    if (!arr.length) return []
    return arr.slice(-amount)
  }

  /**
   * Creates an identical shallow copy of this collection
   */
  public clone(): Collection<K, V> {
    return new Collection([...this.entries()])
  }

  /**
   * The intersect method returns a new structure containing items where the keys are present in both original structures.
   * @param other The other Collection to filter against
   */
  public intersect(other: Collection<K, unknown>): Collection<K, V> {
    return this.filter((_, k) => other.has(k))
  }

  /**
   * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
   * @param other The other Collection to filter against
   */
  public difference(other: Collection<K, unknown>): Collection<K, V> {
    return this.filter((_, k) => !other.has(k))
  }

  /**
   * Combines this collection with others into a new collection
   * @param collections Collections to merge
   */
  public concat(...collections: Collection<K, V>[]): Collection<K, V> {
    const newColl = this.clone()
    for (const coll of collections) {
      for (const [key, val] of coll) newColl.set(key, val)
    }
    return newColl
  }

  /**
   * Checks if this collection shares identical items with another
   * @param collection Collection to compare with
   */
  public equals(collection: Collection<K, V>): boolean {
    if (this === collection) return true
    if (this.size !== collection.size) return false
    for (const [key, value] of this) {
      if (!collection.has(key) || collection.get(key) !== value) {
        return false
      }
    }
    return true
  }
} 