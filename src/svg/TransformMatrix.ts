import { SElement } from './SVGElement'

export class TransformMatrix {
  el: SElement<any>
  private _x: number = 0
  private _y: number = 0
  private _scale: number = 1

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  constructor(el: SElement<any>) {
    this.el = el
  }

  private combineTransform() {
    const transform = [`translate(${this._x},${this._y})`]
    if (this._scale !== 1) {
      transform.push(`scale(${this._scale})`)
    }
    return transform.join(' ')
  }

  private applyTransform() {
    if (this.el.dom instanceof SVGGElement) {
      this.el.attr({
        transform: this.combineTransform()
      })
    } else {
      this.el.attr({
        x: this._x,
        y: this._y
      })
    }
  }

  move(x: number, y: number) {
    this._x = x
    this._y = y
    this.applyTransform()
  }

  dmove(dx: number, dy: number) {
    this.move(this.x + dx, this.y + dy)
  }

  scale(factor: number) {
    this._scale = factor
    this.applyTransform()
  }
}
