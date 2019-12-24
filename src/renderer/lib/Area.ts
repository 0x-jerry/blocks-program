import { Rect } from './Shape'
import { G } from './G'
import { SElement } from './SElement'
import { Sizeable, Dragger } from '../utils'
import { ScrollPair } from './ScrollBar'
import { EventEmitter, Vec2 } from '@/shared'
import { Debounce } from '@/shared/decrators'

export class AreaContent extends G {
  width: number
  height: number

  events: EventEmitter

  get bbox() {
    const box = this.dom.getBBox()

    if (this.width > box.width + this.width / 2) {
      const contentWidth = this.width - box.width
      box.x -= contentWidth / 2 - box.width / 2
      box.width = contentWidth
    }

    if (this.height > box.height + this.height / 2) {
      const contentHeight = this.height - box.height
      box.y -= contentHeight / 2 - box.height / 2
      box.height = contentHeight
    }

    return box
  }

  get totalWidth(): number {
    return this.bbox.width + this.width
  }

  get totalHeight(): number {
    return this.bbox.height + this.height
  }

  get moveRange() {
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
    const box = this.moveRange

    let x = (this.x - box.left) / box.width
    let y = (this.y - box.top) / box.height

    if (x < 0) x = 0
    if (x > 1) x = 1
    if (y < 0) y = 0
    if (y > 1) y = 1

    return {
      x: +(1 - x).toFixed(8),
      y: +(1 - y).toFixed(8)
    }
  }

  constructor(width: number, height: number) {
    super()
    this.events = new EventEmitter()

    this.setSize(width, height)
  }

  setSize(width: number, height: number) {
    this.width = width
    this.height = height

    const { x, y } = this.currentPercentage
    this.moveTo(x, y)
  }

  moveTo(xPercentage: number, yPercentage: number) {
    const box = this.moveRange

    const x = box.left + (1 - xPercentage) * box.width
    const y = box.top + (1 - yPercentage) * box.height

    this.move(x, y)
  }

  move(x: number, y: number) {
    const box = this.moveRange

    if (x < box.left) x = box.left
    if (x > box.right) x = box.right
    if (y < box.top) y = box.top
    if (y > box.bottom) y = box.bottom

    super.move(x, y)
  }
}

type IAreaEventMap = {
  click: (e: MouseEvent, el?: SElement) => void
  move: (dx: number, dy: number) => void
}

export class Area extends G {
  events: EventEmitter<IAreaEventMap>
  dragger: Dragger

  background: Rect
  content: AreaContent
  scrolls: ScrollPair

  size: Sizeable

  constructor(width: number, height: number) {
    super()
    this.addClasses('s_area')

    this.size = new Sizeable(width, height)
    this.events = new EventEmitter()

    this._initSVG(width, height)
    this._initDragger()

    this.resize()
  }

  private _initSVG(width: number, height: number) {
    this.background = new Rect(width, height)
    this.background.addClasses('s_area_background')

    this.content = new AreaContent(width, height)
    this.content.addClasses('s_area_content')

    this.scrolls = new ScrollPair(1, 1, width, height, 5)
    this.scrolls.events.on('scroll', this._scrollCurrentChanged.bind(this))

    this.append(this.background)
    this.append(this.content)
    this.append(this.scrolls)
  }

  private _scrollCurrentChanged(now: Vec2) {
    const moveableRange = this.content.moveRange
    const currentPercentage = this.content.currentPercentage

    const dx = (now.x - currentPercentage.x) * moveableRange.width
    const dy = (now.y - currentPercentage.y) * moveableRange.height

    this.content.moveTo(now.x, now.y)

    this.events.emit('move', dx, dy)
  }

  private _initDragger() {
    this.dragger = new Dragger(this.background.dom)

    this.dragger.on('dragging', (dx, dy) => {
      const beforeContentPercentage = {
        x: this.content.currentPercentage.x,
        y: this.content.currentPercentage.y
      }

      this.content.dmove(dx, dy)

      const { x, y } = this.content.currentPercentage
      this.scrolls.scrollTo(x, y)

      // Emit move event
      const moveableRange = this.content.moveRange
      const ddx = (x - beforeContentPercentage.x) * moveableRange.width
      const ddy = (y - beforeContentPercentage.y) * moveableRange.height
      this.events.emit('move', ddx, ddy)
    })
  }

  scrollTo(xPercentage: number, yPercentage: number) {
    this.content.moveTo(xPercentage, yPercentage)
    this.scrolls.scrollTo(xPercentage, yPercentage)
  }

  @Debounce(100)
  resize() {
    const { width, height } = this.size

    this.background.setSize(width, height)
    this.content.setSize(width, height)

    this.scrolls.setSize(width, height)
    this.scrolls.setRatio(width / this.content.totalWidth, height / this.content.totalHeight)
    this.scrolls.scrollTo(this.content.currentPercentage.x, this.content.currentPercentage.y)
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
