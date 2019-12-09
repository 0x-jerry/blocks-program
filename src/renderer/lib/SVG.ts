import { SElement } from './SElement'
import { createSVGEl } from '../utils'

export class SVG extends SElement<SVGSVGElement> {
  constructor(width: number = 600, height: number = 400) {
    super(createSVGEl('svg'))
    this._rect.width = width
    this._rect.height = height

    this.attr({
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      width: width,
      height: height
    })
  }

  mount(el: HTMLElement) {
    el.appendChild(this.dom)
    this._rendered = true
  }

  destroy() {
    super.destroy()
  }
}
