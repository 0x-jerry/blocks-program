import { parsePixelOrNumber } from './utils'
import { TransformMatrix } from './TransformMatrix'

export class SElement<T extends keyof SVGElementTagNameMap> {
  static ns = 'http://www.w3.org/2000/svg'

  dom: SVGElementTagNameMap[T]

  private transform: TransformMatrix

  constructor(type: T) {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', type)

    this.transform = new TransformMatrix(this)
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
    this.transform.move(x, y)
  }

  dmove(dx: number, dy: number) {
    this.move(this.transform.x + dx, this.transform.y + dy)
  }

  add(...nodes: SElement<any>[]) {
    nodes.forEach((node) => {
      this.dom.appendChild(node.dom)
    })
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
