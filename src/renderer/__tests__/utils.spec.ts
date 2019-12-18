import { createSVGEl, Transform, Sizeable } from '../utils'

describe('utils', () => {
  it('createSVGEl', () => {
    const svg = createSVGEl('svg')
    expect(svg).toBeInstanceOf(SVGElement)
  })

  it('Transform', () => {
    let transform = ''

    const a = new Transform((s) => (transform = s))

    a.move(1, 2)
    expect(transform).toBe('translate(1, 2)')

    a.move(3, 4)
    expect(transform).toBe('translate(3, 4)')

    a.scale(1)
    expect(transform).toBe('scale(1) translate(3, 4)')

    a.scale(1, 2)
    expect(transform).toBe('scale(1, 2) translate(3, 4)')

    a.scale(3)
    expect(transform).toBe('scale(3) translate(3, 4)')

    a.rotate(16)
    expect(transform).toBe('scale(3) translate(3, 4) rotate(16deg)')
  })

  it('Sizeable', () => {
    const size = new Sizeable(0, 0)
    expect(size.width).toBe(0)
    expect(size.height).toBe(0)

    size.update({ width: 20, height: 20 })
    expect(size.width).toBe(20)
    expect(size.height).toBe(20)
  })
})
