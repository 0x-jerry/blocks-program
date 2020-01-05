import { Rect } from './Shape'
import { G } from './G'
import { Sizeable, Dragger } from '../utils'
import { EventEmitter, Observer, ObserverCallbackFunc, throttle } from '@/shared'
import { IVec2 } from '@/typedef'

type IScrollBarEventMap = {
  'scroll'(posPercentage: number): void
}

export class ScrollBar extends G {
  events: EventEmitter<IScrollBarEventMap>
  dragger: Dragger

  isVertical: boolean

  background: Rect

  scrollBar: Rect

  disabled: Observer<boolean>

  /**
   * scroll current position
   */
  currentPercentage: number

  /**
   * scroll bar length / scroll total length [0 - 1]
   */
  ratio: number

  private _view: {
    length: number
    thickness: number
  }

  get scrollLength() {
    return this.length * (1 - this.ratio)
  }

  get length() {
    return this._view.length
  }

  get thickness() {
    return this._view.thickness
  }

  /**
   *
   * @param ratio =scroll bar length / scroll total length
   * @param length Scroll viewport length
   * @param thickness
   * @param isVertical
   */
  constructor(ratio: number, length = 100, isVertical = false, thickness = 2) {
    super()
    this.ratio = ratio
    this._view = { thickness, length }
    this.isVertical = isVertical
    this.disabled = new Observer(false)
    this.currentPercentage = 0

    this.events = new EventEmitter()

    this._initSVG()
    this.addClasses('s_scroll')

    this.disabled.sub(this._disabledChanged)

    this.dragger = new Dragger(this.scrollBar.dom)

    this._initDragger()
  }

  private _disabledChanged: ObserverCallbackFunc<boolean> = (now) => {
    const disabledClassName = 's_scroll_disabled'

    now ? this.addClasses(disabledClassName) : this.removeClasses(disabledClassName)
  }

  private _initDragger() {
    this.dragger.on('dragging', (dx, dy) => {
      const dPercentage = (this.isVertical ? dy : dx) / this.scrollLength

      this.scrollTo(this.currentPercentage + dPercentage)

      this.events.emit('scroll', this.currentPercentage)
    })
  }

  private _initSVG() {
    if (this.isVertical) {
      this.background = new Rect(this.thickness, this.length, this.thickness / 2)
      this.scrollBar = new Rect(this.thickness, this.length * this.ratio, this.thickness / 2)
    } else {
      this.background = new Rect(this.length, this.thickness, this.thickness / 2)
      this.scrollBar = new Rect(this.length * this.ratio, this.thickness, this.thickness / 2)
    }
    this.background.addClasses('s_scroll_background')
    this.scrollBar.addClasses('s_scroll_bar')

    this.append(this.background)
    this.append(this.scrollBar)

    this.scrollTo(this.currentPercentage)
  }

  private _updateCurrent() {
    const now = this.scrollLength * this.currentPercentage

    if (this.isVertical) {
      this.scrollBar.move(0, now)
    } else {
      this.scrollBar.move(now, 0)
    }
  }

  resize() {
    if (this.isVertical) {
      this.background.attr({ width: this.thickness, height: this.length })
      this.scrollBar.attr({ width: this.thickness, height: this.length * this.ratio })
    } else {
      this.background.attr({ width: this.length, height: this.thickness })
      this.scrollBar.attr({ width: this.length * this.ratio, height: this.thickness })
    }
  }

  setRatio(ratio: number) {
    this.ratio = ratio
    this.resize()
  }

  setViewport(length: number, thickness?: number) {
    this._view.length = length
    this._view.thickness = thickness ?? this.thickness
    this.resize()
  }

  scrollTo(posPercentage: number) {
    if (this.disabled.value) {
      return
    }

    this.currentPercentage = posPercentage < 0 ? 0 : posPercentage >= 1 ? 1 : posPercentage

    this._updateCurrent()
  }

  destroy() {
    super.destroy()
    this.dragger.destroy()
  }
}

type IScrollPairEventsMap = {
  'scroll'(current: IVec2): void
}

export class ScrollPair extends G {
  vertical: ScrollBar

  horizontal: ScrollBar

  readonly thickness: number

  size: Sizeable
  currentPercentage: IVec2
  events: EventEmitter<IScrollPairEventsMap>

  /**
   *
   * @param hRatio Scroll bar ratio [0 - 1]
   * @param vRatio Scroll bar ratio [0 - 1]
   * @param width View size width
   * @param height View size height
   */
  constructor(hRatio: number, vRatio: number, width: number, height: number, thickness = 2) {
    super()

    this._positionChanged = throttle(this._positionChanged, 1000 / 60, { trailing: true })

    this.events = new EventEmitter()
    this.thickness = thickness
    this.size = new Sizeable(width, height)
    this.currentPercentage = { x: 0, y: 0 }

    this._initSVG(vRatio, height, hRatio, width)

    this.setRatio(hRatio, vRatio)
    this.setSize(width, height)
    this.addClasses('s_scrolls')
  }

  private _initSVG(vRatio: number, height: number, hRatio: number, width: number) {
    this.vertical = new ScrollBar(vRatio, height - this.thickness, true, this.thickness)
    this.vertical.addClasses('s_scrolls_vertical')
    this.vertical.events.on('scroll', (pos) => this._positionChanged('y', pos))

    this.horizontal = new ScrollBar(hRatio, width - this.thickness, false, this.thickness)
    this.horizontal.addClasses('s_scrolls_horizontal')
    this.horizontal.events.on('scroll', (pos) => this._positionChanged('x', pos))

    this.setVisible()
  }

  private _positionChanged(type: 'x' | 'y', posPercentage: number) {
    this.currentPercentage[type] = posPercentage
    this.events.emit('scroll', this.currentPercentage)
  }

  scrollTo(xPercentage: number, yPercentage: number) {
    this.horizontal.scrollTo(xPercentage)
    this.vertical.scrollTo(yPercentage)

    this.currentPercentage.x = xPercentage
    this.currentPercentage.y = yPercentage
  }

  setVisible(horizontal = true, vertical = true) {
    const _setVisibleScroll = (scroll: ScrollBar, show = true) => {
      show ? scroll.parent !== this && this.append(scroll) : this.remove(scroll)

      scroll.disabled.update(!show)
    }

    _setVisibleScroll(this.horizontal, horizontal)
    _setVisibleScroll(this.vertical, vertical)
  }

  setDisabled(horizontal = false, vertical = false) {
    this.horizontal.disabled.update(horizontal)
    this.vertical.disabled.update(vertical)
  }

  setSize(width: number, height: number) {
    this.size.update({ width, height })

    this.horizontal.setViewport(width - this.thickness)
    this.horizontal.move(0, height - this.thickness)

    this.vertical.setViewport(height - this.thickness)
    this.vertical.move(width - this.thickness, 0)
  }

  setRatio(hRatio: number, vRatio: number) {
    this.horizontal.setRatio(hRatio)
    this.vertical.setRatio(vRatio)
  }

  destroy() {
    super.destroy()
  }
}
