import { Observer } from '@/shared'

export interface ISize {
  width: number
  height: number
}

export class Sizeable extends Observer<ISize> {
  get width(): number {
    return this.value.width
  }

  get height(): number {
    return this.value.height
  }

  constructor(width = 0, height = 0) {
    super({ width, height })
  }
}
