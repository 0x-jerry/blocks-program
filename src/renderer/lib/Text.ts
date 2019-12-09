import { SElement } from './SElement'
import { createSVGEl } from '../utils'

export class Text extends SElement<SVGTextElement> {
  constructor() {
    super(createSVGEl('text'))
  }

  move(x: number, y: number): void {
    super.move(x, y)
    this.attr({ x, y })
  }
}
