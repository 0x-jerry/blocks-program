import { Dragger } from '@/renderer/utils'

describe('Dragger', () => {
  let dom: HTMLElement
  let dragger: Dragger

  beforeEach(() => {
    dom = document.createElement('div')
    document.body.append(dom)
    dragger = new Dragger(dom)
  })

  it('drag events', () => {
    const fnStart = jest.fn()
    const fn = jest.fn()
    const fnEnd = jest.fn()

    dragger.on('dragging', fn)
    dragger.on('dragstart', fnStart)
    dragger.on('dragend', fnEnd)

    const e = new Event('pointermove')

    window.dispatchEvent(e)
    window.dispatchEvent(e)
    window.dispatchEvent(e)

    dom.dispatchEvent(new Event('pointerdown'))

    window.dispatchEvent(e)
    window.dispatchEvent(e)
    window.dispatchEvent(e)
    window.dispatchEvent(e)

    window.dispatchEvent(new Event('pointerup'))

    expect(fnStart).toBeCalledTimes(1)
    expect(fn).toBeCalledTimes(4)
    expect(fnEnd).toBeCalledTimes(1)
  })

  it('destroy', () => {
    const fnStart = jest.fn()
    dragger.on('dragstart', fnStart)

    dragger.destroy()

    dom.dispatchEvent(new Event('pointerdown'))

    expect(fnStart).toBeCalledTimes(0)
  })
})
