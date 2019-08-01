import * as SVG from '@svgdotjs/svg.js'
import { Gesture } from '../utils/Gesture'
import { Workspace } from '../Workspace'

export interface BlocksContainerOptions {
  x?: number
  y?: number
  fill?: string
  stroke?: string
}

export abstract class BlocksContainer {
  group: SVG.G
  shape: SVG.Path
  gesture: Gesture
  workspace: Workspace

  get x() {
    return this.group.attr('x')
  }

  get y() {
    return this.group.attr('y')
  }

  constructor(workspace: Workspace, opt?: BlocksContainerOptions) {
    const defaultOpt: Required<BlocksContainerOptions> = {
      x: 0,
      y: 0,
      fill: '#eee',
      stroke: '#000'
    }

    opt = Object.assign({}, defaultOpt, opt)
    this.workspace = workspace
    this.shape = new SVG.Path()
    this.group = new SVG.G()
    this.gesture = new Gesture(this.shape.node)

    this.group.add(this.shape)

    this.updateShape({
      fill: opt.fill,
      stroke: opt.stroke
    })

    this.move(opt.x, opt.y)
    this.initializeGesture()
    this.update()
  }

  private initializeGesture() {
    this.gesture.on('dragging', (e: MouseEvent) => {
      this.dmove(e.movementX, e.movementY)
      const dragFilter = this.workspace.filters.dragFilter
      this.group.filterWith(dragFilter)
    })

    this.gesture.on('dragend', () => {
      this.group.unfilter()
    })
  }

  protected updateShape(opt: { fill?: string; stroke?: string; d?: string }) {
    this.shape.attr(opt)
  }

  abstract calcPath(...opts: any[]): string

  update() {
    this.updateShape({ d: this.calcPath() })
  }

  move(x: number, y: number) {
    this.group.translate(x, y)
  }

  dmove(dx: number, dy: number) {
    this.group.translate(this.x + dx, this.y + dy)
  }

  abstract dispose(): any
}
