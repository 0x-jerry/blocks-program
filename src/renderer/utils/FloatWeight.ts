import { css } from './utils'

export class FloatWeight {
  dom: HTMLDivElement

  x: number
  y: number

  actived: boolean

  constructor() {
    this.dom = document.createElement('div')
    this.actived = false

    this._initRootDom()
  }

  private _initRootDom() {
    this.dom.classList.add('s_float_weight')
    document.body.append(this.dom)
  }

  show() {
    this.actived = true
    this.dom.classList.remove('s_float_weight_hide')
    this.dom.classList.add('s_float_weight_show')
  }

  hide() {
    this.actived = false
    this.dom.classList.remove('s_float_weight_show')
    this.dom.classList.add('s_float_weight_hide')
  }

  toggle() {
    if (this.actived) {
      this.hide()
    } else {
      this.show()
    }
  }

  move(x: number, y: number) {
    this.x = x
    this.y = y

    css(this.dom, {
      left: `${x}px`,
      top: `${y}px`
    })
  }

  clear() {
    this.dom.innerHTML = ''
  }

  replace(...nodes: HTMLElement[]) {
    this.clear()
    this.dom.append(...nodes)
  }

  append(...nodes: HTMLElement[]) {
    this.dom.append(...nodes)
  }

  destroy() {
    this.dom.remove()
  }
}
