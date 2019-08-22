import { FilterManager } from '../utils/SVGEffectManager'
import { GestureManager, Gesture, GestureEvent } from '../utils/Gesture'
import { Blocks } from './Blocks'
import { ToolWidget } from '../utils/ToolWidget'
import { SElement } from '../svg/SVGElement';
import { SVG } from '../svg/SVG';

export class Workspace {
  filters: FilterManager

  domRoot: HTMLElement

  group: SElement<'g'>
  svgRoot: SVG

  gesture: Gesture
  gestures: GestureManager

  selectedBlock?: Blocks
  blocks: Blocks[] = []

  toolWidget: ToolWidget

  constructor(el: HTMLElement) {
    this.domRoot = el

    this.group = new SElement('g')

    this.svgRoot = new SVG()
    this.svgRoot.addClasses('blockly-workspace')
    this.svgRoot.add(this.group)

    this.filters = new FilterManager()
    this.filters.appendTo(this.svgRoot.defs)

    this.gesture = new Gesture(this.svgRoot.dom, { includeChildren: false })

    this.gestures = new GestureManager()
    this.gestures.add(this.gesture)

    el.appendChild(this.svgRoot.dom)
    this.initializeEvents()
    this.toolWidget = new ToolWidget(this)
  }

  private initializeEvents() {
    this.gesture.on(GestureEvent.dragging, (e: MouseEvent) => {
      this.group.dmove(e.movementX, e.movementY)
    })

    this.gesture.on(GestureEvent.click, () => {
      if (this.gestures.currentNodes.length <= 1) {
        this.toolWidget.hide()
      }
    })
  }

  selectBlock(block: Blocks) {
    this.group.add(block.group)
    this.selectedBlock = block
  }

  addBlock(block: Blocks) {
    this.blocks.push(block)

    this.gestures.add(block.gesture)

    this.group.add(block.group)
  }

  removeBlock(block: Blocks) {
    const idx = this.blocks.indexOf(block)
    this.blocks.splice(idx, 1)

    this.gestures.remove(block.gesture)

    block.dispose()
  }

  dispose() {
    this.svgRoot.dispose()
    this.gestures.dispose()
  }

  /**
   * Return the data that need to save
   */
  toJson() {}
}
