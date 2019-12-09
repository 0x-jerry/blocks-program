import { SElement } from '../lib/SElement'

interface TransformItem {
  type: 'translate' | 'rotate' | 'scale'
  params: (string | number)[]
}

export class Transform {
  el: SElement

  modifies: TransformItem[]

  constructor(el: SElement) {
    this.el = el
    this.modifies = [
      {
        type: 'scale',
        params: []
      },
      {
        type: 'translate',
        params: []
      },
      {
        type: 'rotate',
        params: []
      }
    ]
  }

  // scale -> translate -> rotate
  private applyTransform() {
    const str = this.modifies
      .filter((modify) => modify.params.length > 0)
      .map((modify) => `${modify.type}(${modify.params.join(', ')})`)
      .join(' ')

    this.el.attr('transform', str)
  }

  private changeModify(type: TransformItem['type'], params: TransformItem['params']) {
    const find = this.modifies.find((m) => m.type === type)!
    find.params = params

    this.applyTransform()
  }

  move(x: number, y: number) {
    const args = [x, y].map((x) => x + 'px')

    this.changeModify('translate', args)
  }

  scale(factor: number): void
  scale(x: number, y: number): void
  scale(xOrFactor: number, y?: number): void {
    if (y) {
      this.changeModify('scale', [xOrFactor, y])
    } else {
      this.changeModify('scale', [xOrFactor])
    }
  }

  rotate(deg: number) {
    this.changeModify('rotate', [`${deg}deg`])
  }
}
