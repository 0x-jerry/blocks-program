import { SElement } from './SElement'
import { createSVGEl } from '../utils'

export class Text extends SElement<SVGTextElement> {
  constructor(text = '') {
    super(createSVGEl('text'))
    this.text(text)
  }

  /**
   * Local coordinates
   */
  move(x: number, y: number): void {
    super.move(x, y)
    this.attr({ x, y })
  }

  text(text: string): void
  text(): string
  text(text?: string): string | void {
    if (text === undefined) {
      return this.dom.textContent || ''
    }

    this.dom.textContent = text
    this.cacheBBox()
  }
}
