import { Observer, ObserverCallbackFunc } from '../Observer'

describe('Observer', () => {
  let observer: Observer<number | null>

  beforeEach(() => {
    observer = new Observer(null)
  })

  it('subscribe duplicate', () => {
    const fn = vi.fn()

    observer.sub(fn)
    observer.sub(fn)

    observer.update(1)

    expect(fn).toBeCalledTimes(1)
  })

  it('sub', async () => {
    const fn: ObserverCallbackFunc<number> = (now, pre) => {
      expect(now).toBe(1)
      expect(pre).toBe(null)
      expect(observer.value).toBe(1)
    }

    const fn2 = vi.fn().mockImplementation(fn)

    observer.sub(fn2)

    observer.update(1)
    expect(fn2).toBeCalledTimes(1)
  })

  it('update', () => {
    observer.update(1)
    expect(observer.value).toBe(1)

    observer.update(null)
    expect(observer.value).toBe(null)

    const fn = vi.fn()
    observer.sub(fn)
    observer.update(2, true)

    expect(fn).toBeCalledTimes(0)
  })

  it('sub multi', () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()

    observer.sub(fn1)
    observer.sub(fn2)
    observer.update(1)

    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
  })

  it('unSub', () => {
    const fn = vi.fn()

    observer.sub(fn)
    observer.unSub(fn)

    observer.update(11)
    expect(fn).toBeCalledTimes(0)
    expect(observer.value).toBe(11)
  })
})
