import { SElement } from './SVGElement'

export class SVG extends SElement<'svg'> {
  defs: SElement<'defs'>

  constructor(width?: number, height?: number) {
    super('svg')
    this.defs = new SElement('defs')
    this.add(this.defs)

    this.attr({
      xmlns: SElement.ns,
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      width: width || 600,
      height: height || 400
    })
  }

  dispose() {
    super.dispose()
    this.defs.dispose()
  }
}
