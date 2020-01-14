import { createSVGEl, Transform, Sizeable, floatWeight } from '../utils'

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

  it('FloatWeight', () => {
    const rendered = document.body.contains(floatWeight.dom)
    expect(rendered).toBe(true)

    const input = document.createElement('input')

    floatWeight.append(input)
    expect(floatWeight.dom.contains(input)).toBe(true)

    floatWeight.replace()
    expect(floatWeight.dom.contains(input)).toBe(false)

    floatWeight.move(10, 20)
    expect(floatWeight.x).toBe(10)
    expect(floatWeight.y).toBe(20)

    floatWeight.show()
    expect(floatWeight.dom.classList.contains('s_float_weight_show')).toBe(true)
    expect(floatWeight.dom.classList.contains('s_float_weight_hide')).toBe(false)

    floatWeight.hide()
    expect(floatWeight.dom.classList.contains('s_float_weight_hide')).toBe(true)
    expect(floatWeight.dom.classList.contains('s_float_weight_show')).toBe(false)
  })
})
