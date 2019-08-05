import { SElement } from './SVGElement'
import { uid } from './utils'

export class SFilter<T extends keyof SVGElementTagNameMap = 'filter'> extends SElement<T> {
  readonly id: string

  constructor(type: T) {
    super(type)
    this.id = uid()
    this.attr({ id: this.id })
  }
}
