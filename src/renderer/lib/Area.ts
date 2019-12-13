import { Rect } from './Shape'
import { G } from './G'
import { SElement } from './SElement'
import { Sizeable, Dragger } from '../utils'
import { ScrollPair } from './ScrollBar'
import { EventEmitter, Configuration, Vec2, ObserverCallbackFunc } from '@/shared'

type IAreaEventMap = {
  click: (e: MouseEvent, el?: SElement) => void
}

interface IAreaOptions {
  autoExpand: boolean
}

export class Area extends G {
  events: EventEmitter<IAreaEventMap>
  dragger: Dragger

  background: Rect
  content: G
  scroll: ScrollPair

  size: Sizeable

  config: Configuration<IAreaOptions>

  get totalWidth(): number {
    if (!this.config.get('autoExpand')) {
      return this.size.width
    }

    return this.size.width * 2 + this.content.bbox.width
  }

  get totalHeight(): number {
    if (!this.config.get('autoExpand')) {
      return this.size.height
    }

    return this.size.height * 2 + this.content.bbox.height
  }

  constructor(width: number, height: number, options: Partial<IAreaOptions> = {}) {
    super()
    this.addClasses('s_area')

    const defaultOpt: IAreaOptions = {
      autoExpand: true
    }

    this.config = new Configuration(Object.assign(defaultOpt, options))

    this.size = new Sizeable(width, height)

    this._initSVG(width, height)

    this.dragger = new Dragger(this.background.dom)
    this.events = new EventEmitter()

    this._initDragger()
  }

  private _initSVG(width: number, height: number) {
    this.background = new Rect(width, height)
    this.background.addClasses('s_area_background')

    this.content = new G()
    this.content.addClasses('s_area_content')

    this.scroll = new ScrollPair(1, 1, width, height, 5)
    this.scroll.current.sub(this._scrollCurrentChanged)

    this.append(this.background)
    this.append(this.content)
    this.append(this.scroll)
  }

  private _scrollCurrentChanged: ObserverCallbackFunc<Vec2> = (now) => {
    const x = (now.x / this.scroll.size.width) * this.totalWidth
    const y = (now.y / this.scroll.size.height) * this.totalHeight

    this.content.move(-x, -y)
  }

  private _initDragger() {
    this.dragger.on('dragging', (dx, dy) => {
      let { x, y } = this.scroll.current.value
      x -= (dx / this.totalWidth) * this.scroll.size.width
      y -= (dy / this.totalHeight) * this.scroll.size.height
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
    for (const el of children) {
      el.dmove(-this.content.x, -this.content.y)
      this.content.append(el)
    }
  }

  removeContent(...children: SElement[]) {
    this.content.remove(...children)
  }

  destroy() {
    super.destroy()
    this.dragger.destroy()
  }
}
