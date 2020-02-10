import { SElement } from './SElement'
import { createSVGEl } from '../utils'

export class SImage extends SElement<SVGImageElement> {
  constructor(src = '') {
    super(createSVGEl('image'))
    this.attr('href', src)
    this.addClasses('s_image')
  }

  /**
   * Local coordinates
   */
  move(x: number, y: number): void {
    super.move(x, y)
    this.attr({ x, y })
  }

  href(src: string): void
  href(): string
  href(src?: string): string | void {
    return this.attr('href', src || null)
  }
}
