import { parseNumber } from './utils'

export class SElement<T extends keyof SVGElementTagNameMap = any> {
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
        if (value === null) {
          this.dom.removeAttribute(key)
        } else {
          this.dom.setAttribute(key, value)
        }
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
    if (this.dom instanceof SVGGElement) {
      const baseVal = this.dom.transform.baseVal
      if (baseVal.numberOfItems) {
        const x = baseVal.getItem(0).matrix.e + dx
        const y = baseVal.getItem(0).matrix.f + dy
        this.move(x, y)
      } else {
        this.move(dx, dy)
      }
    } else {
      const x = (this.attr('x') as number) + dx
      const y = (this.attr('x') as number) + dy
      this.move(x, y)
    }
  }

  add(node: SElement) {
    this.dom.appendChild(node.dom)
  }

  dispose() {
    this.dom.remove()
  }

  addClass(...classes: string[]) {
    this.dom.classList.add(...classes)
  }

  removeClasses(...classes: string[]) {
    this.dom.classList.remove(...classes)
  }
}
