import { Rect } from './Shape'
import { G } from './G'
import { SElement } from './SElement'
import { Sizeable, Dragger } from '../utils'
import { ScrollPair } from './ScrollBar'
import { SArray, EventEmitter } from '@/shared'

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

type IAreaEventMap = {
  click: (e: MouseEvent, el?: SElement) => void
}

export class Area extends G {
  events: EventEmitter<IAreaEventMap>
  dragger: Dragger

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
    this.addClasses('s_area')

    this.draggableX = draggableX
    this.draggableY = draggableY

    this.size = new Sizeable(width, height)

    this._initSVG(width, height)

    this.dragger = new Dragger(this.background.dom)
    this.events = new EventEmitter()

    this._initDragger()
  }

  private _initSVG(width: number, height: number) {
    this.background = new AreaBackground(width, height)
    this.background.addClasses('s_area_background')

    this.content = new AreaContent()
    this.content.addClasses('s_area_content')

    this.scroll = new ScrollPair(1, 1, width, height, 5)

    this.append(this.background)
    this.append(this.content)
    this.append(this.scroll)
  }

  private _initDragger() {
    this.dragger.on('dragging', (dx, dy) => {
      const x = this.scroll.current.x - dx
      const y = this.scroll.current.y - dy
      this.scroll.scrollTo(x, y)
    })
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

  appendContent(...children: SElement[]) {
    this.content.append(...children)
  }

  removeContent(...children: SElement[]) {
    this.content.remove(...children)
  }

  destroy() {
    super.destroy()
    this.dragger.destroy()
  }
}
