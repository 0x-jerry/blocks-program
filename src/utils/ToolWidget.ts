import { Workspace } from '../core/Workspace'

export class ToolWidget {
  workspace: Workspace

  visible: boolean

  dom: HTMLDivElement

  constructor(workspace: Workspace) {
    this.workspace = workspace
    this.visible = false

    this.createDom()
    this.workspace.domRoot.appendChild(this.dom)
    this.workspace.on('dragging', () => {
      this.hide()
    })
  }

  private createDom() {
    this.dom = document.createElement('div')
    this.dom.style.position = 'fixed'
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
  }
}
