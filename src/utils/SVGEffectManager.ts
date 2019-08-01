import * as SVG from '@svgdotjs/svg.js'
import Filter from '@svgdotjs/svg.filter.js'

export class FilterManager {
  filters: SVG.Filter[] = []
  dragFilter: SVG.Filter

  constructor() {
    this.buildDragFilter()
  }

  buildDragFilter() {
    // @ts-ignore
    this.dragFilter = new Filter()

    const blur = this.dragFilter
      .offset(0, 0)
      .in(this.dragFilter.$sourceAlpha)
      .gaussianBlur(2, 2)

    this.dragFilter.blend(this.dragFilter.$source, blur, null)
    this.filters.push(this.dragFilter)
  }

  appendTo(defs: SVG.Defs) {
    defs.add(this.dragFilter)
  }

  dispose() {
    this.filters.forEach((filter) => filter.remove())
  }
}
