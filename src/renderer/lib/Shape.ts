import { SElement } from './SElement'
import { createSVGEl } from '../utils'

export class Rect extends SElement<SVGRectElement> {
  private _size: {
    width: number
    height: number
  }

  get width() {
    return this._size.width
  }

  get height() {
    return this._size.height
  }

  constructor(width: number, height: number, rx: number = 0, ry: number = 0) {
    super(createSVGEl('rect'))
    this._size = { width, height }

    this.attr({ width, height, rx, ry })
  }

  setSize(width: number, height: number) {
    this._size.width = width
    this._size.height = height

    this.attr({ width, height })
  }

  move(x: number, y: number) {
    super.move(x, y)
    this.attr({ x, y })
  }
}
