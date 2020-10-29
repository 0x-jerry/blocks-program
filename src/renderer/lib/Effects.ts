import { BasicElement } from './SElement'
import { createSVGEl } from '../utils'
import { uuid } from '../../shared'

/**
 * @todo Refactor
 */
export class DropShadowEffect extends BasicElement<SVGFilterElement> {
  readonly id: string

  constructor(id = uuid()) {
    super(createSVGEl('filter'))
    this.id = id
    this.attr('id', this.id)

    this.dom.innerHTML = `
  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> 
  <feOffset dx="2" dy="2" result="offsetblur"/> 
  <feComponentTransfer>
    <feFuncA type="linear" slope="0.5"/> 
  </feComponentTransfer>
  <feMerge> 
    <feMergeNode/> 
    <feMergeNode in="SourceGraphic"/> 
  </feMerge>
    `
  }
}
