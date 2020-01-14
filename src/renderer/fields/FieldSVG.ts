import { BlockField } from '@/core'
import { SElement } from '../lib'
import { Connection } from '../Connection'
import { BlockSVG } from '../BlockSVG'

export class FieldSVG<T extends BlockField = BlockField, S extends SElement = SElement> {
  $f: T
  $b: BlockSVG

  svg: S

  connection?: Connection

  constructor(block: BlockSVG, field: T, svg: S) {
    this.$f = field
    this.svg = svg
    this.$b = block
  }

  initShape() {
    // Abstract method
  }
}

export interface FieldSVGCtor<T extends BlockField = BlockField, S extends SElement = SElement> {
  new (block: BlockSVG, field: T): FieldSVG<T, S>
}
