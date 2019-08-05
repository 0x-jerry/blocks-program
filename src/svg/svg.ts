import { SVGElement } from './SVGElement'

export class SVG extends SVGElement<'svg'> {
  constructor(width?: number, height?: number) {
    super('svg')

    this.attr({
      xmlns: SVGElement.ns,
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      width: width || 600,
      height: height || 400
    })
  }
}
