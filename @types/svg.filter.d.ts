import { Element, List } from '@svgdotjs/svg.js'

declare module '@svgdotjs/svg.js' {
  // Extensions of the core lib
  interface Element {
    unfilter(): this
  }
}
