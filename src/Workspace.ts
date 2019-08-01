import * as SVG from '@svgdotjs/svg.js'
import { FilterManager } from './blocks/SVGEffectManager'
import { GestureManager, Gesture } from './utils/Gesture'
import { BlocksContainer } from './blocks/Container'

export class Workspace {
  filters: FilterManager
  draw: SVG.Svg
  gestures: GestureManager
  blocks: BlocksContainer[] = []
  gesture: Gesture
  group: SVG.G

  constructor(el: HTMLElement) {
    this.filters = new FilterManager()
    this.draw = SVG.SVG()

    this.group = new SVG.G()
    this.gesture = new Gesture(this.draw.node)
    this.draw.add(this.group)

    this.filters.appendTo(this.draw.defs())

    this.gestures = new GestureManager()
    this.gestures.add(this.gesture)

    this.draw.css({
      border: '1px solid #333',
      width: '80%',
      height: '600px',
      margin: '50px auto',
      display: 'block'
    })

    el.appendChild(this.draw.node)
    this.initializeEvents()
  }

  private initializeEvents() {
    this.gesture.on('dragging', (e: MouseEvent) => {
      this.group.dmove(e.movementX, e.movementY)
    })
  }

  addBlock(block: BlocksContainer) {
    this.blocks.push(block)
    this.gestures.add(block.gesture)
    this.group.add(block.group)
  }

  removeBlock(block: BlocksContainer) {
    const idx = this.blocks.indexOf(block)
    this.blocks.splice(idx, 1)
    this.gestures.remove(block.gesture)
    block.group.remove()
  }
}
