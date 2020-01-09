import { config } from '@/config'
import { SElement, Rect } from './lib'

export class DebugDotSVg {
  svg: Rect
  constructor(x: number, y: number, source: SElement) {
    if (!config.debug) {
      return
    }

    this.svg = new Rect(2, 2)
    this.svg.addClasses('s_debug', 's_debug_dot')
    this.svg.move(x, y)
    source.append(this.svg)
  }
}
