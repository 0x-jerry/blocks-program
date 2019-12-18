import { createSVGEl, Transform } from '../utils'
import { BasicElement } from './SElement'
import { Rect } from './Shape'
import { uuid } from '@/shared'

export class PatternGrid extends BasicElement<SVGPatternElement> {
  readonly id: string

  rect: Rect

  trans: Transform

  x: number

  y: number

  constructor(width: number, height: number, id = uuid()) {
    super(createSVGEl('pattern'))
    this.id = id
    this.x = 0
    this.y = 0

    this.addClasses('s_pattern')
    this.attr({
      id,
      width,
      height,
      patternUnits: 'userSpaceOnUse'
    })

    this.rect = new Rect(width, height)
    this.rect.addClasses('s_pattern_grid')

    this.append(this.rect)

    this.trans = new Transform((transform) => {
      this.attr('patternTransform', transform)
    })
  }

  scale(factor: number) {
    this.trans.scale(factor)
  }

  move(x: number, y: number) {
    this.x = x
    this.y = y

    this.attr({ x, y })
  }

  dmove(dx: number, dy: number) {
    this.move(this.x + dx, this.y + dy)
  }
}
