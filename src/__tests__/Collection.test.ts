import { describe, expect, it, beforeEach } from '@jest/globals'
import { Collection } from '../utils/Collection.js'

describe('Collection', () => {
  let collection: Collection<string, number>

  beforeEach(() => {
    collection = new Collection()
  })

  describe('constructor', () => {
    it('should create an empty collection', () => {
      expect(collection.size).toBe(0)
    })

    it('should create collection from iterable', () => {
      const entries: [string, number][] = [['a', 1], ['b', 2]]
      const col = new Collection(entries)
      expect(col.size).toBe(2)
      expect(col.get('a')).toBe(1)
      expect(col.get('b')).toBe(2)
    })
  })

  describe('basic operations', () => {
    it('should set and get values', () => {
      collection.set('key1', 100)
      expect(collection.get('key1')).toBe(100)
    })

    it('should check if key exists', () => {
      collection.set('key1', 100)
      expect(collection.has('key1')).toBe(true)
      expect(collection.has('key2')).toBe(false)
    })

    it('should delete values', () => {
      collection.set('key1', 100)
      expect(collection.delete('key1')).toBe(true)
      expect(collection.has('key1')).toBe(false)
      expect(collection.delete('key1')).toBe(false)
    })

    it('should clear all values', () => {
      collection.set('key1', 100)
      collection.set('key2', 200)
      collection.clear()
      expect(collection.size).toBe(0)
    })
  })

  describe('array methods', () => {
    beforeEach(() => {
      collection.set('a', 1)
      collection.set('b', 2)
      collection.set('c', 3)
    })

    it('should map values', () => {
      const mapped = collection.map(value => value * 2)
      expect(mapped).toEqual([2, 4, 6])
    })

    it('should reduce values', () => {
      const sum = collection.reduce((acc, value) => acc + value, 0)
      expect(sum).toBe(6)
    })
  })

  describe('utility methods', () => {
    beforeEach(() => {
      collection.set('a', 1)
      collection.set('b', 2)
      collection.set('c', 3)
    })

    it('should get first value', () => {
      expect(collection.first()).toBe(1)
    })

    it('should get last value', () => {
      expect(collection.last()).toBe(3)
    })

    it('should get random value', () => {
      const random = collection.random()
      expect([1, 2, 3]).toContain(random)
    })

    it('should convert to array', () => {
      const array = collection.array()
      expect(array).toEqual([1, 2, 3])
    })

    it('should get keys array', () => {
      const keys = collection.keyArray()
      expect(keys).toEqual(['a', 'b', 'c'])
    })

    it('should clone collection', () => {
      const cloned = collection.clone()
      expect(cloned.size).toBe(3)
      expect(cloned.get('a')).toBe(1)
      expect(cloned.get('b')).toBe(2)
      expect(cloned.get('c')).toBe(3)
    })
  })
}) 