export function uuid() {
  let uuid = ''

  for (let i = 0; i < 32; i += 1) {
    switch (i) {
      case 8:
      case 20:
        uuid += '-'
        uuid += ((Math.random() * 16) | 0).toString(16)
        break
      case 12:
        uuid += '-'
        uuid += ((Math.random() * 16) | 0).toString(16)
        break
      case 16:
        uuid += '-'
        uuid += ((Math.random() * 4) | 8).toString(16)
        break
      default:
        uuid += ((Math.random() * 16) | 0).toString(16)
    }
  }

  return uuid
}

export function getId<T extends { id: string }>(instanceOrId: T | string) {
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

export function warn(...args: any[]) {
  console.warn(...args)
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

  let trailingHandle: NodeJS.Timeout

  // @ts-ignore
  return function(this: T, ...params: Parameters<T>) {
    const wrapperFunc = func.bind(this)
    const now = new Date().getTime()

    // leading
    if (!firstTimeCalled) {
      firstTimeCalled = true
      lastCalledTime = now

      if (opt.leading) {
        wrapperFunc(...params)
        return
      }
    }

    clearTimeout(trailingHandle)
    // exact time interval
    if (now - lastCalledTime >= time) {
      lastCalledTime = now
      wrapperFunc(...params)
      return
    }

    // between time interval, for trailing
    if (opt.trailing) {
      trailingHandle = setTimeout(() => wrapperFunc(...params), time)
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
  let trailingHandle: NodeJS.Timeout
  let firstTimeCalled = false
  let lastRecordTime = 0

  const opt: IDebounceConfig = Object.assign({ leading: false, trailing: true, maxWait: time }, options)

  //@ts-ignore
  return function(this:T, ...params: any[]) {
    const wrapperFunc = func.bind(this)
    const now = new Date().getTime()

    // leading
    if (!firstTimeCalled) {
      lastRecordTime = now
      firstTimeCalled = true

      if (opt.leading) {
        wrapperFunc(...params)
        return
      }
    }

    clearTimeout(trailingHandle)
    // exact time interval
    if (now - lastRecordTime >= time) {
      wrapperFunc(...params)
      lastRecordTime = now
      return
    }

    lastRecordTime = now

    if (opt.trailing) {
      trailingHandle = setTimeout(() => wrapperFunc(...params), opt.maxWait)
    }
  }
}
