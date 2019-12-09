import { SElement } from './SElement'
import { createSVGEl, Transform } from '../utils'

export class G extends SElement<SVGGElement> {
  trans: Transform

  constructor() {
    super(createSVGEl('g'))
    this.trans = new Transform(this)
  }

  move(x: number, y: number): void {
    super.move(x, y)
    this.trans.move(x, y)
  }
}
