import { IVec2 } from '../typedef'
export { uuid } from '@0x-jerry/utils'

interface IdAble {
  id: string
}

export function getId<T extends IdAble>(instanceOrId: T | string) {
  return typeof instanceOrId === 'string' ? instanceOrId : instanceOrId.id
}

export class SArray<T> extends Array<T> {
  remove(predicate: (o: T) => boolean): T | null {
    const idx = this.findIndex(predicate)

    return idx >= 0 ? this.splice(idx, 1)[0] : null
  }

  removeItem(item: T): T | null {
    const idx = this.indexOf(item)

    return idx >= 0 ? this.splice(idx, 1)[0] : null
  }

  /**
   *
   * Return true when has the item
   */
  pushDistinct(item: T): boolean {
    const has = this.indexOf(item) >= 0

    !has && this.push(item)

    return has
  }
}

export function warn(context: string, ...args: any[]) {
  console.warn(`[${context}]`, ...args)
  console.trace()
}

/**
 * Check whether have at least one item of intersection
 * @param arr1
 * @param arr2
 */
export function oneOf<T>(arr1: T[], arr2: T[]): boolean {
  for (const item of arr1) {
    if (arr2.indexOf(item) >= 0) {
      return true
    }
  }

  return false
}

export function toArray<T>(t: T | T[]): T[] {
  return Array.isArray(t) ? t : [t]
}

export interface IThrottleConfig {
  leading: boolean
  trailing: boolean
}

/**
 *
 * @param options default is { leading: true, trailing: false }
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  time: number,
  options: Partial<IThrottleConfig> = {}
): T {
  let firstTimeCalled = false
  let lastCalledTime = 0

  const opt: IThrottleConfig = Object.assign({ leading: true, trailing: false }, options)

  let trailingHandle: number

  // @ts-ignore
  return function (this: T, ...params: Parameters<T>) {
    const now = new Date().getTime()

    // leading
    if (!firstTimeCalled) {
      firstTimeCalled = true
      lastCalledTime = now

      if (opt.leading) {
        func.apply(this, params)
        return
      }
    }

    clearTimeout(trailingHandle)
    // exact time interval
    if (now - lastCalledTime >= time) {
      lastCalledTime = now
      func.apply(this, params)
      return
    }

    // between time interval, for trailing
    if (opt.trailing) {
      // https://github.com/Microsoft/TypeScript/issues/30128
      trailingHandle = window.setTimeout(() => func.apply(this, params), time)
    }
  }
}

export interface IDebounceConfig {
  leading: boolean
  maxWait: number
  trailing: boolean
}

/**
 * @param options default is { leading: false, trailing: true, maxWait: time }
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  time: number,
  options: Partial<IDebounceConfig> = {}
): T {
  let trailingHandle: number
  let firstTimeCalled = false
  let lastRecordTime = 0

  const opt: IDebounceConfig = Object.assign({ leading: false, trailing: true, maxWait: time }, options)

  //@ts-ignore
  return function (this: T, ...params: any[]) {
    const now = new Date().getTime()

    // leading
    if (!firstTimeCalled) {
      lastRecordTime = now
      firstTimeCalled = true

      if (opt.leading) {
        func.apply(this, params)
        return
      }
    }

    clearTimeout(trailingHandle)

    // check exact time interval
    if (now - lastRecordTime >= time) {
      func.apply(this, params)
      lastRecordTime = now
      return
    }

    lastRecordTime = now

    if (opt.trailing) {
      // https://github.com/Microsoft/TypeScript/issues/30128
      trailingHandle = window.setTimeout(() => func.apply(this, params), opt.maxWait)
    }
  }
}

export function vec2Distance(v1: IVec2, v2: IVec2) {
  return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
}
