import { Rect } from './Shape'
import { G } from './G'
import { SElement } from './SElement'
import { Sizeable, Dragger } from '../utils'
import { ScrollPair } from './ScrollBar'
import { EventEmitter, Vec2 } from '@/shared'
import { Debounce } from '@/shared/decrators'

type IAreaEventMap = {
  click: (e: MouseEvent, el?: SElement) => void
}

export class AreaContent extends G {
  readonly width: number
  readonly height: number

  events: EventEmitter

  get totalWidth(): number {
    return this.bbox.width + this.width
  }

  get totalHeight(): number {
    return this.bbox.height + this.height
  }

  get moveableRange() {
    const bbox = this.bbox

    const origin = {
      x: bbox.x - this.width / 2,
      y: bbox.y - this.height / 2
    }

    return {
      width: bbox.width,
      height: bbox.height,
      left: -(origin.x + bbox.width),
      top: -(origin.y + bbox.height),
      right: -origin.x,
      bottom: -origin.y
    }
  }

  get currentPercentage() {
    const box = this.moveableRange

    const x = (this.x - box.left) / box.width
    const y = (this.y - box.top) / box.height

    if (x < 0 || y < 0 || x > 1 || y > 1) {
      return { x: 0, y: 0 }
    }

    return { x, y }
  }

  constructor(width: number, height: number) {
    super()

    this.width = width
    this.height = height

    this.events = new EventEmitter()
  }

  moveTo(xPercentage: number, yPercentage: number) {
    const box = this.moveableRange

    const x = box.left + xPercentage * box.width
    const y = box.top + yPercentage * box.height

    this.move(x, y)
  }

  move(x: number, y: number) {
    const box = this.moveableRange

    if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) {
      super.move(x, y)
    }
  }
}

export class Area extends G {
  events: EventEmitter<IAreaEventMap>
  dragger: Dragger

  background: Rect
  content: AreaContent
  scroll: ScrollPair

  size: Sizeable

  constructor(width: number, height: number) {
    super()
    this.addClasses('s_area')

    this.size = new Sizeable(width, height)
    this.events = new EventEmitter()

    this._initSVG(width, height)
    this._initDragger()
  }

  private _initSVG(width: number, height: number) {
    this.background = new Rect(width, height)
    this.background.addClasses('s_area_background')

    this.content = new AreaContent(width, height)
    this.content.addClasses('s_area_content')

    this.scroll = new ScrollPair(1, 1, width, height, 5)
    this.scroll.events.on('scroll', this._scrollCurrentChanged.bind(this))

    this.append(this.background)
    this.append(this.content)
    this.append(this.scroll)
  }

  private _scrollCurrentChanged(now: Vec2) {
    this.content.moveTo(now.x, now.y)
  }

  private _initDragger() {
    this.dragger = new Dragger(this.background.dom)

    this.dragger.on('dragging', (dx, dy) => {
      this.content.dmove(dx, dy)

      const { x, y } = this.content.currentPercentage
      this.scroll.scrollTo(x, y)
    })
  }

  scrollTo(xPercentage: number, yPercentage: number) {
    this.content.moveTo(xPercentage, yPercentage)
    this.scroll.scrollTo(xPercentage, yPercentage)
  }

  @Debounce(100, { trailing: true })
  resize() {
    const { width, height } = this.size

    this.background.setSize(width, height)

    this.scroll.setSize(width, height)
    this.scroll.setRatio(width / this.content.totalWidth, height / this.content.totalHeight)

    const currentPercentagePos = this.content.currentPercentage
    this.scroll.scrollTo(currentPercentagePos.x, currentPercentagePos.y)
    this.content.moveTo(currentPercentagePos.x, currentPercentagePos.y)
  }

  setSize(width: number, height: number) {
    this.size.update({ width, height })
    this.resize()
  }

  appendContent(...children: SElement[]) {
    for (const el of children) {
      el.dmove(-this.content.x, -this.content.y)
      this.content.append(el)
    }

    this.resize()
  }

  removeContent(...children: SElement[]) {
    this.content.remove(...children)

    this.resize()
  }

  destroy() {
    super.destroy()
    this.dragger.destroy()
  }
}
