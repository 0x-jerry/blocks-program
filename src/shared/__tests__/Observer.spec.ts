import { Observer, ObserverCallbackFunc } from '../Observer'

describe('Observer', () => {
  let observer: Observer<number>

  beforeEach(() => {
    observer = new Observer()
  })

  it('subscribe duplicate', () => {
    const fn = jest.fn()

    observer.sub(fn)
    observer.sub(fn)

    observer.set(1)

    expect(fn).toBeCalledTimes(1)
  })

  it('sub', (done) => {
    const fn: ObserverCallbackFunc<number> = (now, pre) => {
      expect(now).toBe(1)
      expect(pre).toBe(null)
      expect(observer.value).toBe(1)
      done()
    }

    observer.sub(fn)

    observer.set(1)
  })

  it('set', () => {
    observer.set(1)
    expect(observer.value).toBe(1)

    observer.set(null)
    expect(observer.value).toBe(null)
  })

  it('sub multi', () => {
    const fn1 = jest.fn()
    const fn2 = jest.fn()

    observer.sub(fn1)
    observer.sub(fn2)
    observer.set(1)

    expect(fn1).toBeCalledTimes(1)
    expect(fn2).toBeCalledTimes(1)
  })

  it('unSub', () => {
    const fn = jest.fn()

    observer.sub(fn)
    observer.unSub(fn)

    observer.set(11)
    expect(fn).toBeCalledTimes(0)
    expect(observer.value).toBe(11)
  })
})
