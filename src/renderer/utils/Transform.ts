interface TransformItem {
  type: 'translate' | 'rotate' | 'scale'
  params: (string | number)[]
}

export class Transform {
  modifies: TransformItem[]

  readonly setTransform: (transform: string) => void

  constructor(func: (transform: string) => void) {
    this.setTransform = func
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
  protected applyTransform() {
    const str = this.modifies
      .filter((modify) => modify.params.length > 0)
      .map((modify) => `${modify.type}(${modify.params.join(', ')})`)
      .join(' ')

    this.setTransform(str)
  }

  protected changeModify(type: TransformItem['type'], params: TransformItem['params']) {
    const find = this.modifies.find((m) => m.type === type)!
    find.params = params

    this.applyTransform()
  }

  move(x: number, y: number) {
    this.changeModify('translate', [x, y])
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
