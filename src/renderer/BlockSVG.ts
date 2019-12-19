import { Block } from '@/core'
import { G, Path, SElement } from './lib'
import { FIELD_TYPES } from '@/fields'
import { SArray } from '@/shared'
import { BlockTextFieldSVG } from './fields'
import { Renderer } from './Renderer'

export class BlockSVG extends G {
  readonly $b: Block
  readonly $r: Renderer

  background: Path
  fields: SArray<SElement>
  totalWidth: number
  totalHeight: number

  constructor(block: Block, renderer: Renderer) {
    super()
    this.totalHeight = 0
    this.totalWidth = 0
    this.$r = renderer
    this.$b = block
    this.background = new Path()
    this.fields = new SArray()

    this.append(this.background)
    this._initFieldsSVG()
  }

  private _initFieldsSVG() {
    for (const field of this.$b.fieldManager.fields) {
      let fieldEl: SElement | null = null

      switch (field.type) {
        case FIELD_TYPES.TEXT:
          fieldEl = new BlockTextFieldSVG(field)
          break

        default:
          break
      }

      if (fieldEl) {
        this.fields.pushDistinct(fieldEl)
        this.append(fieldEl)
      }
    }
  }

  updateFieldsShape() {
    let x = 0
    let y = 0

    for (let idx = 0; idx < this.fields.length; idx++) {
      const field = this.fields[idx]
      const previousField = this.fields[idx - 1]
      x = 0
      y = (this.totalHeight - field.bbox.height) / 2

      if (previousField) {
        x = previousField.x + previousField.bbox.width
      }

      const gap = 2

      x += gap

      field.move(x, y)
    }
  }

  updateOutputShape() {
    this.background.d.clear()
    this.background.d.M(0, 0).done()
  }

  updateBackgroundShape() {
    if (this.$b.hasOutput) {
      this.updateOutputShape()
      return
    }
    this.background.d.clear()

    this.background.d.M(0, 0)
    const widthGap = 2
    const heightGap = 4

    const width = this.fields.reduce((pre, cur) => pre + cur.bbox.width, 0) + (this.fields.length + 1) * widthGap

    const height = Math.max(...this.fields.map((f) => f.bbox.height)) + heightGap * 2

    this.totalWidth = width
    this.totalHeight = height

    if (this.$b.config.get('previous')) {
      this.background.d
        .l(0, 1)
        .v(1, 0)
        .l(0, 1)
        .v(-1, 0)
    } else {
      this.background.d.l(0, 3)
    }

    this.background.d
      .l(width - 3, 0)
      .v(-height)
      .l(-(width - 3), 0)
      .v(height, 0)
      .done()
  }

  updateShape() {
    if (!this.rendered) {
      this.$r.workspaceSVG.appendContent(this)
    }
    this.updateBackgroundShape()
  }
}
