import { EventEmitter } from '@/shared'

type IGlobalDomEvent = {
  mouseup(e: MouseEvent): void
  mousemove(e: MouseEvent): void
}

const globalDomEvent = new EventEmitter<IGlobalDomEvent>()

window.addEventListener('mouseup', (e) => globalDomEvent.emit('mouseup', e))
window.addEventListener('mousemove', (e) => globalDomEvent.emit('mousemove', e))

type IDraggableEventsMap = {
  dragstart(): void
  dragging(dx: number, dy: number): void
  dragend(): void
}

export class Dragger extends EventEmitter<IDraggableEventsMap> {
  private dom: Element
  private _isDragging: boolean

  get isDragging() {
    return this._isDragging
  }

  constructor(dom: Element) {
    super()
    this.dom = dom
    this._isDragging = false

    this._mousedown = this._mousedown.bind(this)
    this._mouseup = this._mouseup.bind(this)
    this._mousemove = this._mousemove.bind(this)

    this.dom.addEventListener('mousedown', this._mousedown)

    globalDomEvent.on('mousemove', this._mousemove)
    globalDomEvent.on('mouseup', this._mouseup)
  }

  private _mousedown() {
    this._isDragging = true
    this.emit('dragstart')
  }

  private _mousemove(e: MouseEvent) {
    if (!this.isDragging) {
      return
    }

    this.emit('dragging', e.movementX, e.movementY)
  }

  private _mouseup() {
    this._isDragging = false
    this.emit('dragend')
  }

  destroy() {
    this.dom.removeEventListener('mousedown', this._mousedown)
    globalDomEvent.off('mouseup', this._mouseup)
    globalDomEvent.off('mousemove', this._mousemove)
  }
}
