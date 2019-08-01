import * as SVG from '@svgdotjs/svg.js'
import { Gesture } from '../utils/Gesture'
import { Workspace } from '../core/Workspace'
import { Field } from '../fields/Field'

export interface BlocksContainerOptions {
  x?: number
  y?: number
  fill?: string
  stroke?: string
}

export abstract class BlocksContainer {
  fields: Field[] = []
  group: SVG.G
  shape: SVG.Path
  gesture: Gesture
  /**
   * All sub properties are only read, don't do side effect things
   */
  workspace: Workspace

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
    this.gesture = new Gesture(this.group.node)

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
      // @ts-ignore
      this.group.unfilter()
    })
  }

  abstract calcPath(...opts: any[]): string

  updateShape(opt: { fill?: string; stroke?: string; d?: string }) {
    this.shape.attr(opt)
  }

  getFieldsWidth() {
    return this.fields.reduce((pre, cur) => {
      return pre + cur.rectBox().w
    }, 0)
  }

  getFieldsHeight() {
    return Math.max(...this.fields.map((f) => f.rectBox().h), 0)
  }

  addFiled(field: Field) {
    this.fields.push(field)
    if (field.gesture) {
      this.workspace.gestures.add(field.gesture)
    }
    this.group.add(field.shape)
    this.update()
  }

  removeFiled(field: Field) {
    const idx = this.fields.indexOf(field)
    this.fields.splice(idx, 1)
    if (field.gesture) {
      this.workspace.gestures.remove(field.gesture)
    }
    field.dispose()
  }

  updateField(field: Field) {
    const idx = this.fields.indexOf(field)
    this.fields.slice(idx).forEach((f) => f.updatePosition())
    this.updateShape({ d: this.calcPath() })
  }

  update(fields: boolean = false) {
    if (fields) {
      this.fields.forEach((f) => f.updatePosition())
    }
    this.updateShape({ d: this.calcPath() })
  }

  move(x: number, y: number) {
    this.group.transform({
      position: { x, y }
    })
  }

  dmove(dx: number, dy: number) {
    this.group.translate(dx, dy)
  }

  dispose() {
    this.group.remove()
  }
}
