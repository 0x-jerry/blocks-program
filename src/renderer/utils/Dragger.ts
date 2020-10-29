import { EventEmitter } from '../../shared'
import { globalDomEvent } from './utils'

export type IDraggableEventsMap = {
  dragstart(e: MouseEvent): void
  dragging(dx: number, dy: number, e: MouseEvent): void
  dragend(e: MouseEvent): void
}

export class Dragger extends EventEmitter<IDraggableEventsMap> {
  private doms: (HTMLElement | SVGElement)[]
  private _isDragging: boolean

  get isDragging() {
    return this._isDragging
  }

  constructor(...doms: (HTMLElement | SVGElement)[]) {
    super()
    this.doms = doms

    this._isDragging = false

    this._pointerdown = this._pointerdown.bind(this)
    this._pointerup = this._pointerup.bind(this)
    this._pointermove = this._pointermove.bind(this)

    for (const dom of this.doms) {
      dom.addEventListener('pointerdown', this._pointerdown)
      dom.classList.add('s_dragger')
    }

    globalDomEvent.on('pointermove', this._pointermove)
    globalDomEvent.on('pointerup', this._pointerup)
  }

  private _pointerdown(e: MouseEvent) {
    this._isDragging = true
    this.emit('dragstart', e)

    document.documentElement.classList.add('s_dragger_dragging')
    for (const dom of this.doms) {
      dom.classList.add('s_dragger_dragging')
    }
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

    document.documentElement.classList.remove('s_dragger_dragging')
    for (const dom of this.doms) {
      dom.classList.remove('s_dragger_dragging')
    }
  }

  destroy() {
    for (const dom of this.doms) {
      dom.removeEventListener('pointerdown', this._pointerdown)
    }

    globalDomEvent.off('pointerup', this._pointerup)
    globalDomEvent.off('pointermove', this._pointermove)
  }
}
