import { IThrottleConfig, throttle, IDebounceConfig, debounce } from './utils'

export function Throttle(time: number, options: Partial<IThrottleConfig>): MethodDecorator {
  return (target, prop, descriptor) => {
    const func = descriptor.value as any

    descriptor.value = throttle(func, time, options)
  }
}

export function Debounce(time: number, options: Partial<IDebounceConfig>): MethodDecorator {
  return (target, prop, descriptor) => {
    const func = descriptor.value as any

    descriptor.value = debounce(func, time, options)
  }
}
