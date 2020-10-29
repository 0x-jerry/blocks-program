import { BlockField } from '../../core'
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

    this.svg.addClasses('s_field')
  }

  initShape() {
    // Abstract method
  }

  release() {
    this.svg.removeClasses('s_field_focus')
    this.$b.$r.currentActiveField = undefined
  }

  focus() {
    this.svg.addClasses('s_field_focus')
    this.$b.$r.currentActiveField = this
  }
}

export interface FieldSVGCtor<T extends BlockField = BlockField, S extends SElement = SElement> {
  new (block: BlockSVG, field: T): FieldSVG<T, S>
}
