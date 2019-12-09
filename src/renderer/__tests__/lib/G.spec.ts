import { G } from '@/renderer/lib'

describe('G', () => {
  let g: G

  beforeEach(() => {
    g = new G()
  })

  it('new', () => {
    expect(g.dom.tagName.toUpperCase()).toBe('G')
  })

  it('move', () => {
    g.move(10, 10)

    expect(g.x).toBe(10)
    expect(g.y).toBe(10)
    expect(g.attr('transform')).toBe('translate(10px, 10px)')

    g.move(-10, -110)

    expect(g.x).toBe(-10)
    expect(g.y).toBe(-110)
    expect(g.attr('transform')).toBe('translate(-10px, -110px)')
  })
})
