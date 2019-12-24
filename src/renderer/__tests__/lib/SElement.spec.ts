import { SElement, SVG } from '../../lib'
import { createSVGEl } from '../../utils'
import { mockBBoxRect } from '../jest.setup'

describe('SElement', () => {
  let el: SElement<SVGGElement>

  beforeEach(() => {
    el = new SElement(createSVGEl('g'))
  })

  it('visible', () => {
    const v = el.visible()
    expect(v).toBe(true)
    el.visible(false)
    expect(el.dom.style.visibility).toBe('hidden')

    el.visible(true)
    expect(el.dom.style.visibility).toBe('')
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

    el.attr('test', null)
    expect(el.dom.getAttribute('test')).toBeNull()
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

    expect(el.bbox).toEqual(mockBBoxRect())
  })

  it('append', () => {
    const a = new SElement(createSVGEl('g'))

    el.append(a)
    expect(el.dom.children[0]).toBe(a.dom)
  })

  it('remove', () => {
    const a = new SElement(createSVGEl('g'))

    el.append(a)
    el.remove(a)

    expect(el.children.length).toBe(0)
    expect(el.dom.children.length).toBe(0)
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

  it('on/off event', () => {
    let clicked = 0
    const fn = () => (clicked += 1)

    el.on('click', fn)
    el.dom.dispatchEvent(new Event('click'))
    expect(clicked).toBe(1)

    el.off('click', fn)
    el.dom.dispatchEvent(new Event('click'))
    expect(clicked).toBe(1)
  })

  it('destroy', () => {
    const a = new SElement(createSVGEl('g'))
    el.append(a)

    const $div = document.createElement('div')
    $div.appendChild(el.dom)

    expect($div.children[0]).toBe(el.dom)
    expect(el.children.length).toBe(1)
    expect(el.dom.children.length).toBe(1)

    el.destroy()
    expect($div.children[0]).toBeFalsy()

    expect(el.children.length).toBe(0)
    expect(el.dom.children.length).toBe(0)
  })
})
