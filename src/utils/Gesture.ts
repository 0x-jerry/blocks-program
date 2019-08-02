import Event from 'events'

export enum GestureEvent {
  dragging = 'dragging',
  dragstart = 'dragstart',
  dragend = 'dragend',
  click = 'click'
}

export class GestureManager extends Event {
  nodes: Gesture[] = []
  currentNodes: Gesture[] = []
  isDragging = false

  constructor() {
    super()
    this.initialize()
  }

  add(gesture: Gesture) {
    this.nodes.push(gesture)
  }

  remove(gesture: Gesture) {
    const idx = this.nodes.indexOf(gesture)
    this.nodes.splice(idx, 1)
  }

  private initialize() {
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)

    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  private handleMouseDown(e: MouseEvent) {
    this.currentNodes = []
    this.nodes.forEach((node) => {
      if (node.opts.includeChildren) {
        if (node.node.contains(e.target as Node)) {
          this.currentNodes.push(node)
        }
      } else {
        if (node.node === e.target) {
          this.currentNodes.push(node)
        }
      }
    })

    if (this.currentNodes.length) {
      this.currentNodes.forEach((n) => n.emit(GestureEvent.dragstart, e))
      this.emit(GestureEvent.dragstart, e)
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (this.currentNodes.length) {
      this.isDragging = true
      this.currentNodes.forEach((n) => n.emit(GestureEvent.dragging, e))
      this.emit(GestureEvent.dragging, e)
    }
  }

  private handleMouseUp(e: MouseEvent) {
    if (this.currentNodes.length) {
      if (this.isDragging) {
        this.currentNodes.forEach((n) => n.emit(GestureEvent.dragend, e))
        this.emit(GestureEvent.dragend, e)
      } else {
        this.currentNodes.forEach((n) => n.emit(GestureEvent.click, e))
        this.emit(GestureEvent.click, e)
      }
    }

    this.isDragging = false
    this.currentNodes = []
  }

  dispose() {
    document.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }
}

type DomElement = HTMLElement | SVGElement

export interface GestureOptions {
  includeChildren?: boolean
}

export class Gesture extends Event {
  node: DomElement
  opts: Required<GestureOptions>

  constructor(node: DomElement, opt?: GestureOptions) {
    super()
    this.node = node

    const defaultOpts: Required<GestureOptions> = {
      includeChildren: true
    }

    this.opts = Object.assign({}, defaultOpts, opt)
  }
}
