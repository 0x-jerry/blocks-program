import { Text, SVG } from '../../lib'
import { mockBBoxRect } from '../jest.setup'

describe('Text', () => {
  let text: Text

  beforeEach(() => {
    text = new Text()
  })

  it('new', () => {
    expect(text.dom.tagName.toUpperCase()).toBe('TEXT')
  })

  it('move', () => {
    text.move(10, 10)

    expect(text.x).toBe(10)
    expect(text.y).toBe(10)

    expect(text.attr('x')).toBe(10)

    text.move(-10, -110)

    expect(text.x).toBe(-10)
    expect(text.y).toBe(-110)

    expect(text.attr('x')).toBe(-10)
  })

  it('text', () => {
    const s = new SVG()
    s.mount(document.body)

    expect(text.text()).toBe('')
    text.text('hello')
    expect(text.text()).toBe('hello')

    s.append(text)
    expect(text.bbox).toEqual(mockBBoxRect())
  })
})
