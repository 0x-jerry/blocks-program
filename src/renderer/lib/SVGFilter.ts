import { SElement } from './SVGElement'
import { uuid } from '../utils/utils'

export class SFilter<T extends keyof SVGElementTagNameMap> extends SElement<T> {
  readonly id: string

  constructor(type: T) {
    super(type)
    this.id = uuid.next()
    this.attr({ id: this.id })
  }
}
