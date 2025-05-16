/**
 * A snowflake is a unique identifier used by Discord.
 * @see https://discord.com/developers/docs/reference#snowflakes
 */
export type Snowflake = string

/**
 * A utility type to make all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * A utility type to make all properties of T nullable
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null
}

/**
 * A utility type to make all properties of T mutable
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * A utility type to make all properties of T required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P]
}

/**
 * A utility type to make all properties of T optional
 */
export type Optional<T> = {
  [P in keyof T]+?: T[P]
}

/**
 * A utility type to pick properties from T
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

/**
 * A utility type to omit properties from T
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * A utility type to exclude properties from T
 */
export type Exclude<T, U> = T extends U ? never : T

/**
 * A utility type to extract properties from T
 */
export type Extract<T, U> = T extends U ? T : never

/**
 * A utility type to make all properties of T readonly
 */
export type Readonly<T> = {
  +readonly [P in keyof T]: T[P]
}

/**
 * A utility type to make all properties of T writable
 */
export type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * A utility type to make all properties of T non-nullable
 */
export type NonNullable<T> = T extends null | undefined ? never : T

/**
 * A utility type to make all properties of T required and non-nullable
 */
export type NonNullableRequired<T> = {
  [P in keyof T]-?: NonNullable<T[P]>
}

/**
 * A utility type to make all properties of T optional and nullable
 */
export type NullableOptional<T> = {
  [P in keyof T]+?: T[P] | null
}

/**
 * A utility type to make all properties of T required and readonly
 */
export type RequiredReadonly<T> = {
  +readonly [P in keyof T]-?: T[P]
}

/**
 * A utility type to make all properties of T optional and writable
 */
export type OptionalWritable<T> = {
  -readonly [P in keyof T]+?: T[P]
}

/**
 * A utility type to make all properties of T required and writable
 */
export type RequiredWritable<T> = {
  -readonly [P in keyof T]-?: T[P]
}

/**
 * A utility type to make all properties of T optional and readonly
 */
export type OptionalReadonly<T> = {
  +readonly [P in keyof T]+?: T[P]
}

/**
 * A utility type to make all properties of T non-nullable and readonly
 */
export type NonNullableReadonly<T> = {
  +readonly [P in keyof T]: NonNullable<T[P]>
}

/**
 * A utility type to make all properties of T nullable and writable
 */
export type NullableWritable<T> = {
  -readonly [P in keyof T]: T[P] | null
}

/**
 * A utility type to make all properties of T non-nullable and writable
 */
export type NonNullableWritable<T> = {
  -readonly [P in keyof T]: NonNullable<T[P]>
}

/**
 * A utility type to make all properties of T nullable and readonly
 */
export type NullableReadonly<T> = {
  +readonly [P in keyof T]: T[P] | null
}

/**
 * A utility type to make all properties of T required and nullable
 */
export type RequiredNullable<T> = {
  [P in keyof T]-?: T[P] | null
}

/**
 * A utility type to make all properties of T optional and non-nullable
 */
export type OptionalNonNullable<T> = {
  [P in keyof T]+?: NonNullable<T[P]>
}

/**
 * A utility type to make all properties of T required and non-nullable
 */
export type RequiredNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>
}

/**
 * A utility type to make all properties of T optional and nullable
 */
export type OptionalNullable<T> = {
  [P in keyof T]+?: T[P] | null
}

/**
 * A utility type to make all properties of T required, readonly and non-nullable
 */
export type RequiredReadonlyNonNullable<T> = {
  +readonly [P in keyof T]-?: NonNullable<T[P]>
}

/**
 * A utility type to make all properties of T optional, writable and nullable
 */
export type OptionalWritableNullable<T> = {
  -readonly [P in keyof T]+?: T[P] | null
}

/**
 * A utility type to make all properties of T required, writable and non-nullable
 */
export type RequiredWritableNonNullable<T> = {
  -readonly [P in keyof T]-?: NonNullable<T[P]>
}

/**
 * A utility type to make all properties of T optional, readonly and nullable
 */
export type OptionalReadonlyNullable<T> = {
  +readonly [P in keyof T]+?: T[P] | null
}

/**
 * A utility type to make all properties of T required, readonly and nullable
 */
export type RequiredReadonlyNullable<T> = {
  +readonly [P in keyof T]-?: T[P] | null
}

/**
 * A utility type to make all properties of T optional, writable and non-nullable
 */
export type OptionalWritableNonNullable<T> = {
  -readonly [P in keyof T]+?: NonNullable<T[P]>
}

/**
 * A utility type to make all properties of T required, writable and nullable
 */
export type RequiredWritableNullable<T> = {
  -readonly [P in keyof T]-?: T[P] | null
}

/**
 * A utility type to make all properties of T optional, readonly and non-nullable
 */
export type OptionalReadonlyNonNullable<T> = {
  +readonly [P in keyof T]+?: NonNullable<T[P]>
}
