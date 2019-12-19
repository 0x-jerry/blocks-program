import { EventEmitter } from '@/shared'

type IGlobalDomEvent = {
  pointerup(e: MouseEvent): void
  pointermove(e: MouseEvent): void
}

const globalDomEvent = new EventEmitter<IGlobalDomEvent>()

window.addEventListener('pointerup', (e) => globalDomEvent.emit('pointerup', e))
window.addEventListener('pointermove', (e) => globalDomEvent.emit('pointermove', e))

type IDraggableEventsMap = {
  dragstart(e: MouseEvent): void
  dragging(dx: number, dy: number, e: MouseEvent): void
  dragend(e: MouseEvent): void
}

export class Dragger extends EventEmitter<IDraggableEventsMap> {
  private dom: HTMLElement | SVGElement
  private _isDragging: boolean

  get isDragging() {
    return this._isDragging
  }

  constructor(dom: HTMLElement | SVGElement) {
    super()
    this.dom = dom

    this.dom.style.cursor = 'grab'

    this._isDragging = false

    this._pointerdown = this._pointerdown.bind(this)
    this._pointerup = this._pointerup.bind(this)
    this._pointermove = this._pointermove.bind(this)

    this.dom.addEventListener('pointerdown', this._pointerdown)

    globalDomEvent.on('pointermove', this._pointermove)
    globalDomEvent.on('pointerup', this._pointerup)
  }

  private _pointerdown(e: MouseEvent) {
    this._isDragging = true
    this.emit('dragstart', e)

    document.body.style.cursor = 'grabbing'
    this.dom.style.cursor = ''
  }

  private _pointermove(e: MouseEvent) {
    if (!this.isDragging) {
      return
    }

    this.emit('dragging', e.movementX, e.movementY, e)
  }

  private _pointerup(e: MouseEvent) {
    this._isDragging = false
    this.emit('dragend', e)

    document.body.style.cursor = ''
    this.dom.style.cursor = 'grab'
  }

  destroy() {
    this.dom.removeEventListener('pointerdown', this._pointerdown)
    globalDomEvent.off('pointerup', this._pointerup)
    globalDomEvent.off('pointermove', this._pointermove)
  }
}
