export class FloatWeight {
  dom: HTMLDivElement

  x: number
  y: number

  constructor() {
    this.dom = document.createElement('div')

    this._initRootDom()
  }

  private _initRootDom() {
    this.dom.classList.add('s_float_weight')
    document.body.append(this.dom)
  }

  show() {
    this.dom.classList.remove('s_float_weight_hide')
    this.dom.classList.add('s_float_weight_show')
  }

  hide() {
    this.dom.classList.remove('s_float_weight_show')
    this.dom.classList.add('s_float_weight_hide')
  }

  move(x: number, y: number) {
    this.x = x
    this.y = y

    this.dom.style.left = `${x}px`
    this.dom.style.top = `${y}px`
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