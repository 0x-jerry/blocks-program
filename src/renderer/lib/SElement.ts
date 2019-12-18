import { SArray } from '@/shared'

interface AttributeObject {
  [key: string]: string | number | null
}

export class BasicElement<T extends Element = Element> {
  protected _parent: BasicElement | null

  dom: T
  children: SArray<BasicElement>

  get rendered() {
    return document.body.contains(this.dom)
  }

  get parent() {
    return this._parent
  }

  constructor(dom: T) {
    this.dom = dom
    this.children = new SArray()
  }

  protected getAttr(name: string): string | null | number {
    const attr = this.dom.getAttribute(name)
    if (!attr) {
      return attr
    }

    const px = +attr
    return Number.isNaN(px) ? attr : px
  }

  protected setAttr(name: string, val: string | number | null) {
    if (val === null) {
      this.dom.removeAttribute(name)
    } else {
      this.dom.setAttribute(name, String(val))
    }
  }

  on<K extends keyof ElementEventMap>(
    type: K,
    listener: (this: T, ev: ElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void
  on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    this.dom.addEventListener(type, listener, options)
  }

  off<K extends keyof ElementEventMap>(
    type: K,
    listener: (this: T, ev: ElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void
  off(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
    this.dom.removeEventListener(type, listener, options)
  }

  attr(attrs: AttributeObject): void
  attr(attrName: string): string | number | null
  attr(attrName: string, attrVal: string | number | null): void
  attr(attrsOrName: AttributeObject | string, attrVal?: string | number | null): string | number | null | void {
    if (typeof attrsOrName === 'string') {
      if (attrVal !== undefined) {
        this.setAttr(attrsOrName, attrVal)
      } else {
        return this.getAttr(attrsOrName)
      }
    } else {
      Object.entries(attrsOrName).forEach(([key, val]) => {
        this.setAttr(key, val)
      })
    }
  }

  append(...children: BasicElement[]) {
    for (const el of children) {
      this.dom.appendChild(el.dom)
      this.children.pushDistinct(el)
      el._parent = this
    }
  }

  remove(...children: BasicElement[]) {
    for (const el of children) {
      const hasEl = this.children.removeItem(el)

      if (hasEl) {
        this.dom.removeChild(el.dom)
        el._parent = null
      }
    }
  }

  addClasses(...classes: string[]) {
    this.dom.classList.add(...classes)
  }

  removeClasses(...classes: string[]) {
    this.dom.classList.remove(...classes)
  }

  destroy() {
    this.dom.remove()

    this.children.forEach((child) => {
      this.remove(child)
      child.destroy()
    })

    this._parent = null
  }
}

export class SElement<T extends SVGGraphicsElement = SVGGraphicsElement> extends BasicElement<T> {
  x: number
  y: number

  get bbox(): DOMRect {
    return this.dom.getBBox()
  }

  constructor(dom: T) {
    super(dom)
    this.x = 0
    this.y = 0
  }

  on<K extends keyof SVGElementEventMap>(
    type: K,
    listener: (this: SVGGElement, ev: SVGElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void
  on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    this.dom.addEventListener(type, listener, options)
  }

  off<K extends keyof SVGElementEventMap>(
    type: K,
    listener: (this: SVGGElement, ev: SVGElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void
  off(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
    this.dom.removeEventListener(type, listener, options)
  }

  /**
   * Local coordinates
   */
  move(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  dx(dx: number) {
    this.move(this.x + dx, this.y)
  }

  dy(dy: number) {
    this.move(this.x, this.y + dy)
  }

  dmove(dx: number, dy: number): void {
    this.move(this.x + dx, this.y + dy)
  }
}
