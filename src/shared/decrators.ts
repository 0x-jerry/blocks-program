import { IThrottleConfig, throttle, IDebounceConfig, debounce } from './utils'

export function Throttle(time: number, options: Partial<IThrottleConfig>): MethodDecorator {
  return (target, prop, descriptor) => {
    const func: Function = descriptor.value as any

    descriptor.value = throttle(func.bind(target), time, options)
  }
}

export function Debounce(time: number, options: Partial<IDebounceConfig>): MethodDecorator {
  return (target, prop, descriptor) => {
    const func: Function = descriptor.value as any

    descriptor.value = debounce(func.bind(target), time, options)
  }
}
