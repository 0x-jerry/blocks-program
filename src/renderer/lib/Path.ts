import { SElement } from './SElement'
import { createSVGEl } from '../utils'

export class Path extends SElement<SVGPathElement> {
  constructor() {
    super(createSVGEl('path'))
  }
}
