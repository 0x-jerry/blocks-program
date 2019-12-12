import { SElement } from './SElement'
import { createSVGEl } from '../utils'

class D {
  el: Path
  path: (string | number)[]

  constructor(el: Path) {
    this.el = el
    this.clear()
  }

  pushCoords(coords: number[]) {
    const step = 2

    for (let i = 0; i < coords.length; i += step) {
      if (i + step > coords.length) {
        break
      }

      this.path.push(`${coords[i]},${coords[i + 1]}`)
    }
  }

  d(cmd: string, params: number[], pairCount = 1) {
    this.path.push(cmd)

    for (let i = 0; i < params.length; i += pairCount) {
      if (i + pairCount > params.length) {
        break
      }

      const partParams = params.slice(i, i + pairCount)
      const isCoords = pairCount % 2 === 0

      if (isCoords) {
        this.pushCoords(partParams)
      } else {
        this.path.push(...partParams)
      }
    }

    return this
  }

  clear() {
    this.path = []
  }

  done() {
    const p = this.path.join(' ')

    this.el.updatePath(p)
  }

  /**
   * Horizontal line to (x,y)+
   */
  H(...lines: number[]) {
    return this.d('H', lines)
  }

  /**
   * Horizontal line to (dx,dy)+
   */
  h(...lines: number[]) {
    return this.d('h', lines)
  }

  /**
   * Vertical line to (x,y)+
   */
  V(...lines: number[]) {
    return this.d('V', lines)
  }

  /**
   * Vertical line to (dx,dy)+
   */
  v(...lines: number[]) {
    return this.d('v', lines)
  }

  /**
   * Move to (x,y)+
   */
  M(...coords: number[]) {
    return this.d('M', coords, 2)
  }

  /**
   * Move to (dx,dy)+
   */
  m(...coords: number[]) {
    return this.d('m', coords, 2)
  }

  /**
   * Line to (x,y)+
   */
  L(...coords: number[]) {
    return this.d('L', coords, 2)
  }

  /**
   * Line to (dx,dy)+
   */
  l(...coords: number[]) {
    return this.d('l', coords, 2)
  }

  /**
   * Smooth Quadratic Bezier Curve (x,y)+
   */
  T(...coords: number[]) {
    return this.d('T', coords, 2)
  }

  /**
   * Smooth Quadratic Bezier Curve (dx,dy)+
   */
  t(...coords: number[]) {
    return this.d('t', coords, 2)
  }

  /**
   * Smooth Cubic Bezier Curve (x2,y2, x,y)+
   */
  S(...coords: number[]) {
    return this.d('S', coords, 4)
  }

  /**
   * Smooth Cubic Bezier Curve (dx2,dy2, dx,dy)+
   */
  s(...coords: number[]) {
    return this.d('s', coords, 4)
  }

  /**
   * Quadratic Bezier Curve (x1,y1, x,y)+
   */
  Q(...coords: number[]) {
    return this.d('Q', coords, 4)
  }

  /**
   * Quadratic Bezier Curve (dx1,dy1, dx,dy)+
   */
  q(...coords: number[]) {
    return this.d('q', coords, 4)
  }

  /**
   * Cubic Bezier Curve (x1,y1, x2,y2, x,y)+
   */
  C(...coords: number[]) {
    return this.d('C', coords, 6)
  }

  /**
   * Cubic Bezier Curve (dx1,dy1, dx2,dy2, dx,dy)+
   */
  c(...coords: number[]) {
    return this.d('c', coords, 6)
  }

  /**
   * Elliptical Arc Curve (rx ry angle large-arc-flag sweep-flag x y)+
   */
  A(rx: number, ry: number, angle: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, x: number, y: number) {
    this.path.push('A', rx, ry, angle, largeArcFlag, sweepFlag, `${x},${y}`)
    return this
  }

  /**
   * Elliptical Arc Curve (rx ry angle large-arc-flag sweep-flag dx dy)+
   */
  a(rx: number, ry: number, angle: number, largeArcFlag: 0 | 1, sweepFlag: 0 | 1, dx: number, dy: number) {
    this.path.push('a', rx, ry, angle, largeArcFlag, sweepFlag, `${dx},${dy}`)
    return this
  }

  /**
   * ClosePath
   */
  Z() {
    this.d('Z', [])
    this.done()
  }

  /**
   * ClosePath
   */
  z() {
    this.d('z', [])
    this.done()
  }
}

export class Path extends SElement<SVGPathElement> {
  d: D

  constructor() {
    super(createSVGEl('path'))
    this.d = new D(this)
  }

  updatePath(p: string) {
    this.attr('d', p)
  }
}
