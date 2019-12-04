import { parsePixelOrNumber } from '../utils/utils'
import { TransformMatrix } from '../utils/TransformMatrix'
import { ObjectAny } from '@/typedef'

export class SElement<T extends keyof SVGElementTagNameMap> {
  static ns = 'http://www.w3.org/2000/svg'

  dom: SVGElementTagNameMap[T]

  private transform: TransformMatrix

  constructor(type: T) {
    this.dom = document.createElementNS('http://www.w3.org/2000/svg', type)

    this.transform = new TransformMatrix(this)
    this.textElementPreSetting()
  }

  private textElementPreSetting() {
    if (!(this.dom instanceof SVGTextElement)) {
      return
    }

    this.attr({
      textAnchor: 'middle',
      dominantBaseline: 'middle'
    })
  }

  attr(obj: ObjectAny | string) {
    if (typeof obj === 'string') {
      const attr = this.dom.getAttribute(obj)
      const mayNumber = parsePixelOrNumber(attr)

      return Number.isNaN(mayNumber) ? attr : mayNumber
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]

        const lowerCase = key.replace(/[A-Z]/g, (k) => `-${k.toLowerCase()}`)

        if (value === null) {
          this.dom.removeAttribute(lowerCase)
        } else {
          this.dom.setAttribute(lowerCase, value)
        }
      }
    }
  }

  bbox(): DOMRect | null {
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
