interface AttributeObject {
  [key: string]: string | number | null
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export class SElement<T extends SVGGraphicsElement = SVGGraphicsElement> {
  protected _rendered: boolean

  protected _rect: Rect

  dom: T

  get x() {
    return this._rect.x
  }

  get y() {
    return this._rect.y
  }

  get width() {
    return this._rect.width
  }

  get height() {
    return this._rect.height
  }

  get rendered() {
    return this._rendered
  }

  get bbox(): Rect {
    return Object.assign({}, this._rect)
  }

  constructor(dom: T) {
    this.dom = dom
    this._rendered = false
    this._rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  }

  private getAttr(name: string): string | null | number {
    const attr = this.dom.getAttribute(name)
    if (!attr) {
      return attr
    }

    const px = +attr
    return Number.isNaN(px) ? attr : px
  }

  private setAttr(name: string, val: string | number | null) {
    if (val === null) {
      this.dom.removeAttribute(name)
    } else {
      this.dom.setAttribute(name, String(val))
    }
  }

  protected cacheBBox() {
    if (this._rendered) {
      this._rect = this.dom.getBBox()
    }
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

  /**
   * Local coordinates
   */
  move(x: number, y: number): void {
    this._rect.x = x
    this._rect.y = y
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

  render(el: SElement) {
    el.dom.appendChild(this.dom)
    this._rendered = el.rendered
    this.cacheBBox()
  }

  add(...nodes: SElement[]) {
    nodes.forEach((node) => {
      node._rendered = this._rendered
      this.dom.appendChild(node.dom)
    })
  }

  addClasses(...classes: string[]) {
    this.dom.classList.add(...classes)
  }

  removeClasses(...classes: string[]) {
    this.dom.classList.remove(...classes)
  }

  destroy() {
    this.dom.remove()
  }
}
