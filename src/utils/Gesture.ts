import { EventEmitter } from "events";

export enum GestureEvent {
  dragging = 'dragging',
  dragstart = 'dragstart',
  dragend = 'dragend',
  click = 'click',
  contextmenu = 'contextmenu'
}

export class GestureManager extends EventEmitter {
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
    this.handleContextMenu = this.handleContextMenu.bind(this)

    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('contextmenu', this.handleContextMenu)
  }

  private checkButton(e: MouseEvent, button: 'left' | 'middle' | 'right') {
    const map = {
      left: 0,
      middle: 1,
      right: 2
    }

    return e.button === map[button]
  }

  private checkCurrentNodes(target: Node) {
    const currentNodes: Gesture[] = []
    this.nodes.forEach((node) => {
      if (node.opts.includeChildren) {
        if (node.node.contains(target as Node)) {
          currentNodes.push(node)
        }
      } else {
        if (node.node === target) {
          currentNodes.push(node)
        }
      }
    })

    return currentNodes
  }

  private emitWithSelf(event: GestureEvent, ...args: any[]) {
    this.currentNodes.forEach((n) => n.emit(event, ...args))
    this.emit(event, ...args)
  }

  private handleContextMenu(e: MouseEvent) {
    this.currentNodes = this.checkCurrentNodes(e.target as Node)

    if (this.currentNodes.length) {
      e.preventDefault()
      this.emitWithSelf(GestureEvent.contextmenu, e)
      this.currentNodes = []
    }
  }

  private handleMouseDown(e: MouseEvent) {
    if (!this.checkButton(e, 'left')) {
      return
    }

    this.currentNodes = this.checkCurrentNodes(e.target as Node)

    if (this.currentNodes.length) {
      this.emitWithSelf(GestureEvent.dragstart, e)
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.checkButton(e, 'left')) {
      return
    }

    if (this.currentNodes.length) {
      this.isDragging = true
      this.emitWithSelf(GestureEvent.dragging, e)
    }
  }

  private handleMouseUp(e: MouseEvent) {
    if (!this.checkButton(e, 'left')) {
      return
    }

    if (this.currentNodes.length) {
      if (this.isDragging) {
        this.emitWithSelf(GestureEvent.dragend, e)
      } else {
        this.emitWithSelf(GestureEvent.click, e)
      }
    }

    this.isDragging = false
    this.currentNodes = []
  }

  dispose() {
    document.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('contextmenu', this.handleContextMenu)
  }
}

type DomElement = HTMLElement | SVGElement

export interface GestureOptions {
  includeChildren?: boolean
}

export class Gesture extends EventEmitter {
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
