import { Gesture, GestureEvent } from '../utils/Gesture'
import { Workspace } from '../core/Workspace'
import { Field } from '../fields/Field'
import { BlockFiled } from './BlockField'
import { SElement } from '../svg/SVGElement'

export interface BlocksContainerOptions {
  x?: number
  y?: number
  fill?: string
  stroke?: string
}

export abstract class BlockContainer {
  static defaultOpt: Required<BlocksContainerOptions> = {
    x: 0,
    y: 0,
    fill: '#eee',
    stroke: '#000'
  }

  fields: BlockFiled[] = []
  group: SElement<'g'>
  shape: SElement<'path'>
  gesture: Gesture
  /**
   * All sub properties are only read, don't do side effect things
   */
  workspace: Workspace

  caches = {
    fields: {
      width: 0,
      height: 0
    }
  }

  style = {
    paddingTop: 5
  }

  constructor(workspace: Workspace, opt?: BlocksContainerOptions) {
    opt = Object.assign({}, BlockContainer.defaultOpt, opt)
    this.workspace = workspace
    this.shape = new SElement('path')
    this.group = new SElement('g')
    this.gesture = new Gesture(this.group.dom)

    this.group.add(this.shape)

    this.updateShape({
      fill: opt.fill,
      stroke: opt.stroke
    })

    this.move(opt.x, opt.y)
    this.initializeGesture()
    this.updateShapeWithoutCache()
  }

  private initializeGesture() {
    this.gesture.on('dragstart', () => {
      this.workspace.selectBlock(this)
    })

    this.gesture.on(GestureEvent.dragging, (e: MouseEvent) => {
      this.dmove(e.movementX, e.movementY)
      const dragFilter = this.workspace.filters.dragFilter

      this.group.attr({ filter: `url(#${dragFilter.id})` })
    })

    this.gesture.on(GestureEvent.dragend, () => {
      this.group.attr({ filter: null })
    })
  }

  abstract calcPath(...opts: any[]): string

  private updateShape(opt: { fill?: string; stroke?: string; d?: string }) {
    this.shape.attr(opt)
  }

  private updateFieldCache() {
    this.caches.fields.width = this.fields.reduce((pre, cur) => {
      return pre + cur.rectBox().width
    }, 0)

    this.caches.fields.height = Math.max(...this.fields.map((f) => f.rectBox().height), 0)
  }

  addFiled(field: Field) {
    this.fields.push(new BlockFiled(this, field))
    if (field.gesture) {
      this.workspace.gestures.add(field.gesture)
    }
    this.group.add(field.group)

    Promise.resolve().then(() => {
      this.updateField(field)
    })
  }

  getPreviousField(filed: Field) {
    const idx = this.fields.findIndex((f) => f.field === filed)
    return this.fields[idx - 1]
  }

  removeFiled(field: Field) {
    const idx = this.fields.findIndex((f) => f.field === field)
    this.fields.splice(idx, 1)
    if (field.gesture) {
      this.workspace.gestures.remove(field.gesture)
    }
    field.dispose()
  }

  updateField(field: Field) {
    this.updateShapeWithoutCache()

    const idx = this.fields.findIndex((f) => f.field === field)
    this.fields.slice(idx).forEach((f) => f.updatePosition())

    this.updateShape({ d: this.calcPath() })
  }

  updateShapeWithoutCache() {
    this.updateFieldCache()
    this.updateShape({ d: this.calcPath() })
  }

  move(x: number, y: number) {
    this.group.move(x, y)
  }

  dmove(dx: number, dy: number) {
    this.group.dmove(dx, dy)
  }

  rectBox() {
    return this.group.bbox()
  }

  dispose() {
    this.group.dispose()
  }

  /**
   * Return the data that need to save
   */
  toJson() {}
}
