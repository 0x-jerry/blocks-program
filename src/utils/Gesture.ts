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
    document.addEventListener('mousedown', (e) => {
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
    })

    document.addEventListener('mousemove', (e) => {
      if (this.currentNodes.length) {
        this.isDragging = true
        this.currentNodes.forEach((n) => n.emit(GestureEvent.dragging, e))
        this.emit(GestureEvent.dragging, e)
      }
    })

    document.addEventListener('mouseup', (e) => {
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
    })
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
