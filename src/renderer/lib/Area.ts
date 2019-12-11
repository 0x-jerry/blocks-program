import { Rect } from './Shape'
import { G } from './G'
import { SElement } from './SElement'
import { Sizeable } from '../utils'
import { ScrollPair } from './ScrollBar'
import { SArray, EventEmitter, IEventsMap } from '@/shared'

export class AreaBackground extends Rect {
  effect() {
    //
  }

  drag(x: number, y: number) {
    //
  }
}

export class AreaContent extends G {
  children: SArray<SElement>

  constructor() {
    super()
    this.children = new SArray()
  }

  append(...children: SElement[]) {
    super.append(...children)

    for (const el of children) {
      this.children.pushDistinct(el)
    }
  }

  remove(...children: SElement[]) {
    for (const el of children) {
      this.children.removeItem(el)
    }
  }

  destroy() {
    super.destroy()

    for (const el of this.children) {
      el.destroy()
    }
  }
}

export interface IAreaEventMap extends IEventsMap {
  click: (e: MouseEvent, el?: SElement) => void
}

export class Area extends EventEmitter<IAreaEventMap> {
  background: AreaBackground
  content: AreaContent
  scroll: ScrollPair

  size: Sizeable

  readonly draggableX: boolean

  readonly draggableY: boolean

  get totalWidth(): number {
    if (!this.draggableX) {
      return this.size.width
    }

    if (this.content.bbox.width <= this.size.width / 2) {
      return this.size.width * 2 - this.content.bbox.width
    }

    return this.size.width * 2 + this.content.bbox.width
  }

  get totalHeight(): number {
    if (!this.draggableY) {
      return this.size.width
    }

    if (this.content.bbox.height <= this.size.height / 2) {
      return this.size.height * 2 - this.content.bbox.height
    }

    return this.size.height * 2 + this.content.bbox.height
  }

  constructor(width: number, height: number, draggableX = true, draggableY = true) {
    super()

    this.draggableX = draggableX
    this.draggableY = draggableY

    this.size = new Sizeable(width, height)

    this.background = new AreaBackground(width, height)
    this.background.addClasses('s_area_background')
    this.content = new AreaContent()
    this.content.addClasses('s_area_content')
    this.scroll = new ScrollPair(1, 1, width, height, 5)
  }

  resize() {
    const { width, height } = this.size

    this.background.setSize(width, height)
    this.scroll.setSize(width, height)
    this.scroll.setRatio(width / this.totalWidth, height / this.totalHeight)
  }

  setSize(width: number, height: number) {
    this.size.set({ width, height })
    this.resize()
  }

  render(parentEl: SElement) {
    this.background.render(parentEl)
    this.content.render(parentEl)
    this.scroll.render(parentEl, this.draggableX, this.draggableY)
    this.resize()
  }

  append(...children: SElement[]) {
    this.content.append(...children)
  }

  remove(...children: SElement[]) {
    this.content.remove(...children)
  }

  destroy() {
    this.background.destroy()
    this.content.destroy()
    this.scroll.destroy()
  }
}
