import { sleep } from '@0x-jerry/utils'
import { EventEmitter } from '../EventEmitter'

describe('EventEmitter', () => {
  let e: EventEmitter

  beforeEach(() => {
    e = new EventEmitter()
  })

  it('on', () => {
    const fn = vi.fn()
    e.on('test', fn)

    const evts = e.events('test')
    expect([...evts][0]).toBe(fn)
  })

  it('off', () => {
    const fn = () => {}

    e.on('testoff', fn)
    expect([...e.events('testoff')][0]).toBe(fn)

    e.off('testoff', fn)
    const evts = e.events('testoff')
    expect(evts.size).toBe(0)
  })

  it('emit', async () => {
    const fn = vi.fn()
    e.on('test', fn)

    e.emit('test')
    expect(fn).toBeCalledTimes(1)

    e.on('test1', (p) => {
      expect(p).toBe(1)
    })

    e.emit('test1', 1)

    await sleep(10)
  })

  it('clear', () => {
    const fn = vi.fn()

    e.on('test', fn)
    e.on('test1', fn)
    e.on('test2', fn)

    expect(e.events('test').size).toBe(1)
    expect(e.events('test1').size).toBe(1)
    expect(e.events('test2').size).toBe(1)
    e.clear()

    expect(e.events('test').size).toBe(0)
    expect(e.events('test1').size).toBe(0)
    expect(e.events('test2').size).toBe(0)
  })
})
