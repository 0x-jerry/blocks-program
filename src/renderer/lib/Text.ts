import { SElement } from './SElement'
import { createSVGEl } from '../utils'

export class Text extends SElement<SVGTextElement> {
  constructor(text = '') {
    super(createSVGEl('text'))
    this.text(text)
    this.addClasses('s_text')
  }

  /**
   * Local coordinates
   */
  move(x: number, y: number): void {
    super.move(x, y)

    // Set top-left to origin
    y += this.bbox.height
    // Fixed top padding
    y -= 3

    this.attr({ x, y })
  }

  text(text: string): void
  text(): string
  text(text?: string): string | void {
    if (text === undefined) {
      return this.dom.textContent || ''
    }

    this.dom.textContent = text
  }
}
