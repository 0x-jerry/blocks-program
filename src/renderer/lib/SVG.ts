import { SElement } from './SElement'
import { createSVGEl, Sizeable } from '../utils'

export class Defs extends SElement<SVGDefsElement> {
  constructor() {
    super(createSVGEl('defs'))
  }
}

export class SVG extends SElement<SVGSVGElement> {
  defs: Defs

  size: Sizeable

  constructor(width: number = 600, height: number = 400) {
    super(createSVGEl('svg'))

    this.defs = new Defs()
    this.size = new Sizeable(width, height)

    this.attr({
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      width: width,
      height: height
    })
  }

  mount(el: HTMLElement) {
    el.appendChild(this.dom)

    this.append(this.defs)
  }
}
