import { createSVGEl, Transform } from '../utils'
import { BasicElement } from './SElement'
import { Rect } from './Shape'
import { uuid } from '@/shared'

export class PatternGrid extends BasicElement<SVGPatternElement> {
  readonly id: string

  rect: Rect

  trans: Transform

  constructor(width: number, height: number, id = uuid()) {
    super(createSVGEl('pattern'))
    this.id = id

    this.addClasses('s_pattern')
    this.attr({ id, width, height })

    this.rect = new Rect(width, height)
    this.rect.addClasses('s_pattern_grid')

    this.trans = new Transform((transform) => {
      this.attr('patternTransform', transform)
    })
  }

  scale(factor: number) {
    this.trans.scale(factor)
  }

  move(x: number, y: number) {
    this.attr({ x, y })
  }
}
