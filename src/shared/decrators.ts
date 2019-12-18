import { IThrottleConfig, throttle, IDebounceConfig, debounce } from './utils'

/**
 * Throttle decorator
 * @param options default is { leading: true, trailing: false }
 */
export function Throttle(time: number, options: Partial<IThrottleConfig> = {}): MethodDecorator {
  return (target, prop, descriptor) => {
    const func = descriptor.value as any

    descriptor.value = throttle(func, time, options)
  }
}

/**
 * Debounce decorator
 * @param options default is { leading: false, trailing: true, maxWait: time }
 */
export function Debounce(time: number, options: Partial<IDebounceConfig> = {}): MethodDecorator {
  return (target, prop, descriptor) => {
    const func = descriptor.value as any

    descriptor.value = debounce(func, time, options)
  }
}
