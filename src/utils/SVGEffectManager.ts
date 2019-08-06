import { SFilter } from '../svg/SVGFilter'
import { SElement } from '../svg/SVGElement'

export class FilterManager {
  filters: SFilter<'filter'>[] = []
  dragFilter: SFilter<'filter'>

  constructor() {
    this.buildDragFilter()
  }

  buildDragFilter() {
    this.dragFilter = new SFilter('filter')
    const offset = new SFilter('feOffset')
    offset.attr({
      dx: 0,
      dy: 0,
      in: 'SourceAlpha',
      result: offset.id
    })

    const blur = new SFilter('feGaussianBlur')

    blur.attr({
      in: offset.id,
      result: blur.id,
      stdDeviation: '2 2'
    })

    const blend = new SFilter('feBlend')
    blend.attr({
      result: blend.id,
      in: 'SourceGraphic',
      in2: blur.id
    })

    this.dragFilter.add(offset)
    this.dragFilter.add(blur)
    this.dragFilter.add(blend)
  }

  appendTo(defs: SElement<any>) {
    defs.add(this.dragFilter)
  }

  dispose() {
    this.filters.forEach((filter) => filter.dispose())
  }
}
