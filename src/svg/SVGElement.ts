import { parseNumber } from './utils'

export class SVGElement<T extends keyof SVGElementTagNameMap = any> {
  static ns = 'http://www.w3.org/2000/svg'

  dom: SVGElementTagNameMap[T]

  constructor(type: T) {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', type)
  }

  attr(obj: object | string) {
    if (typeof obj === 'string') {
      const attr = this.dom.getAttribute(obj)
      const mayNumber = parseNumber(attr)
      return Number.isNaN(mayNumber) ? attr : mayNumber
    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        this.dom.setAttribute(key, value)
      }
    }
  }

  bbox(): DOMRect {
    if (this.dom instanceof SVGGraphicsElement) {
      return this.dom.getBBox()
    }
    return null
  }

  move(x: number, y: number) {
    if (this.dom instanceof SVGGElement) {
      this.attr({
        transform: `translate(${x}, ${y})`
      })
    } else {
      this.attr({ x, y })
    }
  }

  dmove(dx: number, dy: number) {
    const x = (this.attr('x') as number) + dx
    const y = (this.attr('x') as number) + dy
    this.move(x, y)
  }

  add(node: SVGElement) {
    this.dom.appendChild(node.dom)
  }
}
