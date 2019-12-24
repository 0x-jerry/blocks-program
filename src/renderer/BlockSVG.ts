import { Block } from '@/core'
import { FIELD_TYPES } from '@/fields'
import { Configuration, SArray } from '@/shared'
import { BlockTextFieldSVG } from './fields'
import { FieldSVG } from './fields/FieldSVG'
import { G, Path } from './lib'
import { Renderer } from './Renderer'
import { Dragger } from './utils'

type BlockSVGOption = {
  fieldGap: number
  horizontalPadding: number
  verticalPadding: number
  x: number
  y: number
  draggable: boolean
}

export class BlockSVG extends G {
  readonly $b: Block
  readonly $r: Renderer
  options: Configuration<BlockSVGOption>

  background: Path
  fields: SArray<FieldSVG>
  totalWidth: number
  totalHeight: number

  dragger: Dragger

  constructor(block: Block, renderer: Renderer, options: Partial<BlockSVGOption> = {}) {
    super()
    this.addClasses('s_block')

    this.options = new Configuration({
      fieldGap: 2,
      horizontalPadding: 5,
      verticalPadding: 5,
      x: 0,
      y: 0,
      draggable: true,
      ...options
    })

    this.totalHeight = 0
    this.totalWidth = 0
    this.$r = renderer
    this.$b = block
    this.fields = new SArray()

    this.move(this.options.get('x'), this.options.get('y'))

    this._initBackground()
    this._initFieldsSVG()
    this._initDragger()

    this.updateShape()
  }

  private _initBackground() {
    this.background = new Path()
    this.background.addClasses('s_block_background')
    this.append(this.background)
  }

  private _initDragger() {
    if (!this.options.get('draggable')) {
      return
    }

    const textFields = this.fields.filter((f) => f.$f.type === FIELD_TYPES.TEXT).map((f) => f.svg.dom)
    this.dragger = new Dragger(this.background.dom, ...textFields)

    this.dragger.on('dragging', (dx, dy) => {
      this.dmove(dx, dy)
    })

    this.dragger.on('dragend', () => {
      this.$r.workspaceSVG.resize()
    })
  }

  private _initFieldsSVG() {
    for (const field of this.$b.fieldManager.fields) {
      let fieldEl: FieldSVG | null = null

      switch (field.type) {
        case FIELD_TYPES.TEXT:
          fieldEl = new BlockTextFieldSVG(field)
          break

        default:
          break
      }

      if (fieldEl) {
        this.fields.pushDistinct(fieldEl)
        this.append(fieldEl.svg)
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
      y = (this.totalHeight - field.svg.bbox.height) / 2

      if (previousField) {
        x = previousField.svg.x + previousField.svg.bbox.width
      }

      x += this.options.get('fieldGap')

      field.svg.move(x, y)
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

    const width =
      this.fields.reduce((pre, cur) => pre + cur.svg.bbox.width, 0) +
      (this.fields.length - 1) * this.options.get('fieldGap') +
      this.options.get('horizontalPadding') * 2

    const height = Math.max(...this.fields.map((f) => f.svg.bbox.height)) + this.options.get('verticalPadding') * 2

    this.totalWidth = width
    this.totalHeight = height

    if (this.$b.config.get('previous')) {
      this.background.d
        .h(1)
        .v(1)
        .h(1)
        .v(-1)
    } else {
      this.background.d.h(3)
    }

    this.background.d
      .h(width - 3)
      .v(height)
      .h(-width)
      .v(-height)
      .done()
  }

  updateShape() {
    if (!this.rendered) {
      return
    }

    this.updateBackgroundShape()
    this.updateFieldsShape()
  }
}
