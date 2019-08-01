import * as SVG from '@svgdotjs/svg.js'
import { Field } from './Field'
import { BlocksContainer } from '../blocks/Container'

export class FieldText extends Field {
  shape: SVG.Element

  constructor(block: BlocksContainer) {
    super(block)
  }

  update(): void {
    throw new Error('Method not implemented.')
  }

  updatePosition(): void {
    throw new Error('Method not implemented.')
  }
}
