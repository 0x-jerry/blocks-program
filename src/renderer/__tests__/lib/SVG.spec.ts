import { SVG } from '@/renderer'

describe('SVG', () => {
  let svg: SVG

  beforeEach(() => {
    svg = new SVG()
  })

  it('new', () => {
    expect(svg.bbox.width).toBe(600)
    expect(svg.bbox.height).toBe(400)

    expect(svg.dom.tagName.toUpperCase()).toBe('SVG')
    expect(svg.dom.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
  })

  it('mount', () => {
    const d = document.createElement('div')
    svg.mount(d)

    expect(svg.rendered).toBe(true)
    expect(d.children[0]).toBe(svg.dom)
  })
})
