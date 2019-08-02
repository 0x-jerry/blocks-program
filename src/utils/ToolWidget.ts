import { Workspace } from '../core/Workspace'
import { GestureEvent } from './Gesture'

export class ToolWidget {
  workspace: Workspace

  visible: boolean

  dom: HTMLDivElement

  constructor(workspace: Workspace) {
    this.workspace = workspace
    this.visible = false

    this.createDom()
    this.workspace.domRoot.appendChild(this.dom)

    this.handleDraggingEvent = this.handleDraggingEvent.bind(this)
    this.workspace.gestures.on(GestureEvent.dragging, this.handleDraggingEvent)
  }

  private handleDraggingEvent() {
    this.hide()
  }

  private createDom() {
    this.dom = document.createElement('div')
    this.dom.classList.add('blockly-tool-widget')

    this.dom.style.position = 'fixed'
    this.hide()
  }

  setDom(el: HTMLElement) {
    this.clearDom()
    this.dom.appendChild(el)
  }

  clearDom() {
    this.dom.innerHTML = ''
  }

  show(x: number, y: number) {
    if (this.visible) {
      this.hide()
    }

    this.dom.style.top = x + 'px'
    this.dom.style.left = y + 'px'
    this.dom.style.display = 'block'

    this.dom.classList.add('show')
    this.visible = true
  }

  hide() {
    if (!this.visible) {
      return
    }

    this.dom.style.display = 'none'

    this.dom.classList.remove('show')
    this.visible = false
  }

  dispose() {
    this.dom.remove()
    this.workspace.gestures.off(GestureEvent.dragging, this.handleDraggingEvent)
  }
}
