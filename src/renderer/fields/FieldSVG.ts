import { BlockField } from '@/core'
import { SElement } from '../lib'

export class FieldSVG<T extends BlockField = BlockField, S extends SElement = SElement> {
  $f: T
  svg: S

  constructor(field: T, svg: S) {
    this.$f = field
    this.svg = svg
  }
}

export interface FieldSVGCtor<T extends BlockField = BlockField, S extends SElement = SElement> {
  new (field: T): FieldSVG<T, S>
}
