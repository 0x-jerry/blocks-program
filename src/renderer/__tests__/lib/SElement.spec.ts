import { SElement, SVG } from '../../lib'
import { createSVGEl } from '../../utils'
import { mockBBoxRect } from '../jest.setup'

describe('SElement', () => {
  let el: SElement<SVGGElement>

  beforeEach(() => {
    el = new SElement(createSVGEl('g'))
  })

  it('attr', () => {
    el.attr('test', 10)

    expect(el.dom.getAttribute('test')).toBe('10')
    expect(el.attr('test')).toBe(10)

    el.attr('test2', '123px')

    expect(el.dom.getAttribute('test2')).toBe('123px')
    expect(el.attr('test2')).toBe('123px')

    el.attr({
      test3: 'xx',
      test2: 'xx'
    })

    expect(el.dom.getAttribute('test3')).toBe('xx')
    expect(el.attr('test2')).toBe('xx')
  })

  it('move', () => {
    el.move(10, 20)

    expect(el.x).toBe(10)
    expect(el.y).toBe(20)
  })

  it('dmove/dx/dy', () => {
    el.move(0, 0)

    el.dmove(10, 10)
    expect(el.x).toBe(10)
    expect(el.y).toBe(10)

    el.dmove(-10, 0)
    expect(el.x).toBe(0)

    el.dmove(0, -10)
    expect(el.y).toBe(0)

    el.dmove(2, 2)
    expect(el.x).toBe(2)
    expect(el.y).toBe(2)

    el.dx(10)
    expect(el.x).toBe(12)

    el.dy(10)
    expect(el.x).toBe(12)
  })

  it('bbox', () => {
    const svg = new SVG()
    svg.mount(document.createElement('div'))

    svg.append(el)

    expect(el.rendered).toBe(true)
    expect(el.bbox).toEqual(mockBBoxRect())
  })

  it('add', () => {
    const a = new SElement(createSVGEl('g'))

    el.append(a)
    expect(el.dom.children[0]).toBe(a.dom)
  })

  it('addClasses', () => {
    expect(el.dom.classList.contains('test')).toBe(false)
    el.addClasses('test')
    expect(el.dom.classList.contains('test')).toBe(true)

    el.addClasses('test1')
    expect(el.dom.classList.contains('test')).toBe(true)
    expect(el.dom.classList.contains('test1')).toBe(true)
  })

  it('removeClasses', () => {
    el.addClasses('test')
    expect(el.dom.classList.contains('test')).toBe(true)
    el.removeClasses('test')
    expect(el.dom.classList.contains('test')).toBe(false)

    el.addClasses('test1', 'test2')
    expect(el.dom.classList.contains('test1')).toBe(true)
    expect(el.dom.classList.contains('test2')).toBe(true)
    el.removeClasses('test1', 'test2')
    expect(el.dom.classList.contains('test1')).toBe(false)
    expect(el.dom.classList.contains('test2')).toBe(false)
  })

  it('destroy', () => {
    const d = document.createElement('div')
    d.appendChild(el.dom)

    expect(d.children[0]).toBe(el.dom)

    el.destroy()
    expect(d.children[0]).toBeFalsy()
  })
})
