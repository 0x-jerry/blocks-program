import { Rect } from './Shape'
import { G } from './G'
import { SElement } from './SElement'
import { Sizeable } from '../utils'

export class ScrollBar extends G {
  isVertical: boolean

  background: Rect

  scrollBar: Rect

  /**
   * scroll current position
   */
  current: number

  /**
   * scroll bar length / scroll total length [0 - 1]
   */
  ratio: number

  private _view: {
    length: number
    thickness: number
  }

  get length() {
    return this._view.length
  }

  get thickness() {
    return this._view.thickness
  }

  /**
   *
   * @param ratio =scroll bar length / scroll total length
   * @param length Scroll viewport length
   * @param thickness
   * @param isVertical
   */
  constructor(ratio: number, length = 100, isVertical = false, thickness = 2) {
    super()
    this.ratio = ratio
    this._view = { thickness, length }
    this.isVertical = isVertical
    this.current = 0
    this._initSVG()
  }

  private _initSVG() {
    if (this.isVertical) {
      this.background = new Rect(this.thickness, this.length)
      this.scrollBar = new Rect(this.thickness, this.length * this.ratio)
    } else {
      this.background = new Rect(this.length, this.thickness)
      this.scrollBar = new Rect(this.length * this.ratio, this.thickness)
    }
    this.background.move(0, 0)
    this.scrollTo(this.current)
  }

  resize() {
    if (this.isVertical) {
      this.background.attr({ width: this.thickness, height: this.length })
      this.scrollBar.attr({ width: this.thickness, height: this.length * this.ratio })
    } else {
      this.background.attr({ width: this.length, height: this.thickness })
      this.scrollBar.attr({ width: this.length * this.ratio, height: this.thickness })
    }
  }

  setRatio(ratio: number) {
    this.ratio = ratio
    this.resize()
  }

  setViewport(length: number, thickness?: number) {
    this._view.length = length
    this._view.thickness = thickness ?? this.thickness
    this.resize()
  }

  scrollTo(pos: number) {
    const maxLen = this.length * (1 - this.ratio)
    this.current = pos < 0 ? 0 : pos > maxLen ? maxLen : pos

    if (this.isVertical) {
      this.scrollBar.move(0, this.current)
    } else {
      this.scrollBar.move(this.current, 0)
    }
  }

  render(el: SElement) {
    super.render(el)
    this.background.render(this)
    this.scrollBar.render(this)
  }
}

export class ScrollPair {
  vertical: ScrollBar

  horizontal: ScrollBar

  readonly thickness: number

  get x() {
    return this.horizontal.current
  }

  get y() {
    return this.vertical.current
  }

  size: Sizeable

  /**
   *
   * @param hRatio Scroll bar ratio [0 - 1]
   * @param vRatio Scroll bar ratio [0 - 1]
   * @param width View size width
   * @param height View size height
   */
  constructor(hRatio: number, vRatio: number, width: number, height: number, thickness = 2) {
    this.thickness = thickness
    this.size = new Sizeable(width, height)

    this.vertical = new ScrollBar(vRatio, height - this.thickness, true, this.thickness)
    this.horizontal = new ScrollBar(hRatio, width - this.thickness, false, this.thickness)

    this.setRatio(hRatio, vRatio)
    this.setSize(width, height)
  }

  scrollTo(x: number, y: number) {
    this.horizontal.scrollTo(x)
    this.vertical.scrollTo(y)
  }

  setSize(width: number, height: number) {
    this.size.set({ width, height })

    this.horizontal.setViewport(width - this.thickness)
    this.horizontal.move(0, height - this.thickness)

    this.vertical.setViewport(height - this.thickness)
    this.horizontal.move(width - this.thickness, 0)
  }

  setRatio(hRatio: number, vRatio: number) {
    this.horizontal.setRatio(hRatio)
    this.vertical.setRatio(vRatio)
  }

  render(el: SElement) {
    this.horizontal.render(el)
    this.vertical.render(el)
  }
}
