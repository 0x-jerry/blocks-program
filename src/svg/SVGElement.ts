import { parsePixelOrNumber } from './utils'

export class SElement<T extends keyof SVGElementTagNameMap = any> {
  static ns = 'http://www.w3.org/2000/svg'

  dom: SVGElementTagNameMap[T]

  x: number
  y: number

  constructor(type: T) {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', type)
    this.x = 0
    this.y = 0
  }

  attr(obj: object | string) {
    if (typeof obj === 'string') {
      const attr = this.dom.getAttribute(obj)
      const mayNumber = parsePixelOrNumber(attr)

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
    this.x = x
    this.y = y

    if (this.dom instanceof SVGGElement) {
      this.attr({
        transform: `translate(${x}, ${y})`
      })
    } else {
      this.attr({ x, y })
    }
  }

  dmove(dx: number, dy: number) {
    this.move(this.x + dx, this.y + dy)
  }

  add(node: SElement) {
    this.dom.appendChild(node.dom)
  }

  dispose() {
    this.dom.remove()
  }

  addClasses(...classes: string[]) {
    this.dom.classList.add(...classes)
  }

  removeClasses(...classes: string[]) {
    this.dom.classList.remove(...classes)
  }
}
