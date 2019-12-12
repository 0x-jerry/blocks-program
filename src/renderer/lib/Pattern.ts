import { createSVGEl, Sizeable, ISize } from '../utils'
import { BasicElement } from './SElement'
import { Rect } from './Shape'
import { ObserverCallbackFunc, uid } from '@/shared'

export function Grid() {
  return `<pattern id="Pattern" x="0" y="0" width=".25" height=".25">
      <rect x="0" y="0" width="50" height="50" fill="skyblue"/>
      <rect x="0" y="0" width="25" height="25" fill="url(#Gradient2)"/>
      <circle cx="25" cy="25" r="20" fill="url(#Gradient1)" fill-opacity="0.5"/>
    </pattern>`
}

export class PatternGrid extends BasicElement<SVGPatternElement> {
  readonly id: string

  rect: Rect
  size: Sizeable

  constructor(width: number, height: number, id = uid()) {
    super(createSVGEl('pattern'))
    this.id = id

    this.rect = new Rect(50, 50)
    this.rect.addClasses('s_pattern_grid')

    this.addClasses('s_pattern')
    this.size.set({ width, height })
    this.size.sub(this._sizeUpdate)
  }

  protected _sizeUpdate: ObserverCallbackFunc<ISize> = (now) => {
    this.attr({
      width: now.width,
      height: now.height
    })
  }

  resize(width?: number, height?: number) {
    width = width ?? this.size.width
    height = height ?? this.size.height
    this.size.set({ width, height })
  }

  move(x: number, y: number) {
    this.dom.setAttribute('x', String(x))
    this.dom.setAttribute('y', String(y))
  }

  render(el: BasicElement) {
    super.render(el)
    this.rect.render(this)
  }

  append(...children: BasicElement[]) {
    super.append(...children)

    for (const el of children) {
      el.render(this)
    }
  }
}
