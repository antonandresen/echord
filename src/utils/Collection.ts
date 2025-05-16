/**
 * A Map with additional utility methods
 */
export class Collection<K, V> extends Map<K, V> {
  /**
   * Creates an array of values from the collection
   */
  public array(): V[] {
    return [...this.values()];
  }

  /**
   * Creates an array of keys from the collection
   */
  public keyArray(): K[] {
    return [...this.keys()];
  }

  /**
   * Obtains the first value(s) in this collection
   * @param amount Amount of values to obtain from the beginning
   */
  public first(amount?: number): V | V[] | undefined {
    if (typeof amount === 'undefined') return this.values().next().value;
    if (amount < 0) return this.last(amount * -1);
    amount = Math.min(this.size, amount);
    const iter = this.values();
    const result: V[] = [];
    for (let i = 0; i < amount; i++) {
      const val = iter.next().value;
      if (val === undefined) break;
      result.push(val);
    }
    return result;
  }

  /**
   * Obtains the last value(s) in this collection
   * @param amount Amount of values to obtain from the end
   */
  public last(amount?: number): V | V[] | undefined {
    const arr = this.array();
    if (typeof amount === 'undefined') return arr[arr.length - 1];
    if (amount < 0) return this.first(amount * -1);
    if (!amount) return [];
    return arr.slice(-amount);
  }

  /**
   * Obtains unique random value(s) from this collection
   * @param amount Amount of values to obtain randomly
   */
  public random(amount?: number): V | V[] | undefined {
    const arr = this.array();
    if (typeof amount === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
    if (arr.length === 0 || !amount) return [];
    return Array.from(
      { length: Math.min(amount, arr.length) },
      (): V => arr.splice(Math.floor(Math.random() * arr.length), 1)[0],
    );
  }

  /**
   * Finds a value in the collection that satisfies the provided testing function
   * @param fn Function used to test with
   * @param thisArg Value to use as `this` when executing function
   */
  public find<T extends V>(
    fn: (value: V, key: K, collection: this) => value is T,
    thisArg?: unknown,
  ): T | undefined;
  public find(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): V | undefined {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return val;
    }
    return undefined;
  }

  /**
   * Finds a key in the collection that satisfies the provided testing function
   * @param fn Function used to test with
   * @param thisArg Value to use as `this` when executing function
   */
  public findKey(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): K | undefined {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return key;
    }
    return undefined;
  }

  /**
   * Maps each item into a value using the callback function
   * @param fn Function that produces an element of the new array
   * @param thisArg Value to use as `this` when executing function
   */
  public map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): T[] {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    const result: T[] = [];
    for (const [key, value] of this.entries()) {
      result.push(fn(value, key, this));
    }
    return result;
  }

  /**
   * Filters out values that don't match the filter function
   * @param fn Function used to test with
   * @param thisArg Value to use as `this` when executing function
   */
  public filter<T extends V>(
    fn: (value: V, key: K, collection: this) => value is T,
    thisArg?: unknown,
  ): Collection<K, T>;
  public filter(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): Collection<K, V> {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    const results = new Collection<K, V>();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  /**
   * Partitions the collection into two collections where the first collection
   * contains the items that passed and the second contains the items that failed
   * @param fn Function used to test with
   * @param thisArg Value to use as `this` when executing function
   */
  public partition<T extends V>(
    fn: (value: V, key: K, collection: this) => value is T,
    thisArg?: unknown,
  ): [Collection<K, T>, Collection<K, Exclude<V, T>>];
  public partition(
    fn: (value: V, key: K, collection: this) => boolean,
    thisArg?: unknown,
  ): [Collection<K, V>, Collection<K, V>] {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    const results: [Collection<K, V>, Collection<K, V>] = [new Collection<K, V>(), new Collection<K, V>()];
    for (const [key, val] of this) {
      if (fn(val, key, this)) {
        results[0].set(key, val);
      } else {
        results[1].set(key, val);
      }
    }
    return results;
  }

  /**
   * Checks if there exists an item that passes a test
   * @param fn Function used to test with
   * @param thisArg Value to use as `this` when executing function
   */
  public some(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  /**
   * Checks if all items passes a test
   * @param fn Function used to test with
   * @param thisArg Value to use as `this` when executing function
   */
  public every<T extends V>(
    fn: (value: V, key: K, collection: this) => value is T,
    thisArg?: unknown,
  ): this is Collection<K, T>;
  public every(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): boolean {
    if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  /**
   * Reduces values to a single value using an accumulator
   * @param fn Function used to reduce with
   * @param initialValue Starting value for the accumulator
   */
  public reduce<T>(fn: (accumulator: T, value: V, key: K, collection: this) => T, initialValue: T): T {
    let accumulator = initialValue;
    for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
    return accumulator;
  }

  /**
   * Creates an identical shallow copy of this collection
   */
  public clone(): Collection<K, V> {
    return new Collection(this);
  }

  /**
   * Combines this collection with others into a new collection
   * @param collections Collections to merge
   */
  public concat(...collections: Collection<K, V>[]): Collection<K, V> {
    const newColl = this.clone();
    for (const coll of collections) {
      for (const [key, val] of coll) newColl.set(key, val);
    }
    return newColl;
  }

  /**
   * Checks if this collection shares identical items with another
   * @param collection Collection to compare with
   */
  public equals(collection: Collection<K, V>): boolean {
    if (this === collection) return true;
    if (this.size !== collection.size) return false;
    for (const [key, value] of this) {
      if (!collection.has(key) || value !== collection.get(key)) {
        return false;
      }
    }
    return true;
  }

  /**
   * The sort method sorts the items of a collection in place and returns it.
   * The sort is not necessarily stable in Node 10 or older.
   * The default sort order is according to string Unicode code points.
   * @param compareFunction Specifies a function that defines the sort order
   */
  public sort(compareFunction: (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number = (x, y): number => Number(x > y) || Number(x === y) - 1): this {
    const entries = [...this.entries()];
    entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));

    this.clear();
    for (const [k, v] of entries) {
      this.set(k, v);
    }
    return this;
  }
} 