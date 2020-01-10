import { uuid, getId, oneOf, toArray, SArray, debounce, throttle, vec2Distance } from '../utils'

describe('utils', () => {
  it('uid', () => {
    const c = '[0-9a-z]'

    const reg = new RegExp(`${c}{8}-${c}{4}-${c}{4}-${c}{4}-${c}{12}`, 'i')

    expect(reg.test(uuid())).toBe(true)
    expect(reg.test(uuid())).toBe(true)
    expect(reg.test(uuid())).toBe(true)
    expect(reg.test(uuid())).toBe(true)
  })

  it('getId', () => {
    const id = '123'
    const obj = {
      id
    }

    expect(getId(id)).toBe(id)
    expect(getId(obj)).toBe(id)
  })

  it('SArray', () => {
    const arr = new SArray(1, 2, 3)

    let removed = arr.remove((n) => n === 1)
    expect(removed).toBe(1)
    expect(arr).toEqual([2, 3])

    removed = arr.removeItem(2)
    expect(arr).toEqual([3])
    expect(removed).toBe(2)

    removed = arr.remove((n) => n === 5)
    expect(removed).toBe(null)
    expect(arr).toEqual([3])

    let has = arr.pushDistinct(3)
    expect(has).toBe(true)
    expect(arr).toEqual([3])

    has = arr.pushDistinct(2)
    expect(has).toBe(false)
    expect(arr).toEqual([3, 2])
  })

  it('oneOf', () => {
    let arr1 = [1, 2, 3]
    let arr2 = [4, 5, 6]

    expect(oneOf(arr1, arr2)).toBe(false)

    arr1 = [1, 2, 3]
    arr2 = [5, 1, 6]

    expect(oneOf(arr1, arr2)).toBe(true)
  })

  it('toArray', () => {
    expect(toArray(1)).toEqual([1])

    expect(toArray([12, 1])).toEqual([12, 1])
  })
})

describe('debounce', () => {
  it('normal', (done) => {
    const fn = jest.fn()
    const wrapper = debounce(fn, 200)

    wrapper()

    expect(fn).toBeCalledTimes(0)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(0)
    }, 100)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1)
      done()
    }, 500)
  })

  it('leading', (done) => {
    const fn = jest.fn()
    const wrapper = debounce(fn, 200, { leading: true })

    wrapper()

    expect(fn).toBeCalledTimes(1)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(1)
    }, 100)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(2)
      done()
    }, 500)
  })

  it('trailing', (done) => {
    const fn = jest.fn()
    const wrapper = debounce(fn, 200, { trailing: false })

    wrapper()

    expect(fn).toBeCalledTimes(0)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(0)
    }, 50)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(1)
    }, 300)

    setTimeout(() => {
      wrapper()
      wrapper()
      wrapper()
      wrapper()
    }, 350)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1)
      done()
    }, 600)
  })

  it('maxWait', (done) => {
    const fn = jest.fn()
    const wrapper = debounce(fn, 200, { maxWait: 400 })

    wrapper()

    expect(fn).toBeCalledTimes(0)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(0)
    }, 100)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(0)
    }, 400)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1)
      done()
    }, 550)
  })

  it('scope', (done) => {
    let c = ''
    class A {
      hi = 'hi'
      constructor() {
        this.test = debounce(this.test, 200)
      }

      test() {
        c = this.hi
      }
    }

    const a = new A()
    a.test()

    setTimeout(() => {
      expect(c).toBe('hi')
      done()
    }, 220)
  })
})

describe('throttle', () => {
  it('normal', (done) => {
    const fn = jest.fn()
    const wrapper = throttle(fn, 200)

    wrapper()
    wrapper()
    wrapper()

    expect(fn).toBeCalledTimes(1)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(2)
    }, 210)

    setTimeout(() => {
      wrapper()
      wrapper()
    }, 220)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(2)
      done()
    }, 500)
  })

  it('leading', (done) => {
    const fn = jest.fn()
    const wrapper = throttle(fn, 200, { leading: false })

    wrapper()
    wrapper()
    wrapper()
    wrapper()

    expect(fn).toBeCalledTimes(0)

    setTimeout(() => {
      wrapper()
      expect(fn).toBeCalledTimes(1)
    }, 220)

    setTimeout(() => {
      wrapper()
      wrapper()
      wrapper()
    }, 250)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1)
      done()
    }, 500)
  })

  it('trailing', (done) => {
    const fn = jest.fn()
    const wrapper = throttle(fn, 200, { trailing: true })

    wrapper()
    wrapper()
    wrapper()

    expect(fn).toBeCalledTimes(1)

    setTimeout(() => {
      wrapper()
      wrapper()
      wrapper()
    }, 10)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(2)
      wrapper()
    }, 240)

    setTimeout(() => {
      wrapper()
    }, 400)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(3)
      done()
    }, 500)

    setTimeout(() => {
      expect(fn).toBeCalledTimes(4)
      done()
    }, 650)
  })

  it('scope', (done) => {
    let c = ''
    class A {
      hi = 'hi'

      constructor() {
        this.test = throttle(this.test, 200)
      }

      test() {
        c = this.hi
      }
    }

    const a = new A()
    a.test()

    setTimeout(() => {
      expect(c).toBe('hi')
      done()
    }, 220)
  })

  it('vec2Distance', () => {
    const distance = vec2Distance({ x: 0, y: 0 }, { x: 3, y: 4 })

    expect(distance).toBe(5)
  })
})
