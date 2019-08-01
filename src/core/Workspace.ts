import * as SVG from '@svgdotjs/svg.js'
import Event from 'events'
import { FilterManager } from '../utils/SVGEffectManager'
import { GestureManager, Gesture } from '../utils/Gesture'
import { BlocksContainer } from '../blocks/Container'
import { ToolWidget } from '../utils/ToolWidget'

export class Workspace extends Event {
  filters: FilterManager
  draw: SVG.Svg
  gestures: GestureManager
  blocks: BlocksContainer[] = []
  gesture: Gesture
  group: SVG.G
  selectedBlock?: BlocksContainer
  root: HTMLElement
  toolWidget: ToolWidget

  constructor(el: HTMLElement) {
    super()
    this.root = el

    this.filters = new FilterManager()
    this.draw = SVG.SVG()

    this.group = new SVG.G()

    this.gesture = new Gesture(this.draw.node, {
      includeChildren: false
    })

    this.draw.add(this.group)

    this.filters.appendTo(this.draw.defs())

    this.gestures = new GestureManager()
    this.gestures.add(this.gesture)

    el.appendChild(this.draw.node)
    this.initializeEvents()
    this.toolWidget = new ToolWidget(this)
  }

  private initializeEvents() {
    this.gesture.on('dragging', (e: MouseEvent) => {
      this.group.translate(e.movementX, e.movementY)
      this.emit('dragging', e)
    })

    this.gesture.on('click', () => {
      if (this.gestures.currentNodes.length <= 1) {
        this.toolWidget.hide()
      }
    })
  }

  selectBlock(block: BlocksContainer) {
    this.group.add(block.group)
    this.selectedBlock = block
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

    block.dispose()
  }

  dispose() {
    this.draw.remove()
  }

  /**
   * Return the data that need to save
   */
  toJson() {}
}
