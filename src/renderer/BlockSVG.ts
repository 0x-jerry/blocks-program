import { Block } from '@/core'
import { FIELD_TYPES } from '@/fields'
import { Configuration, SArray } from '@/shared'
import { FieldSVG } from './fields/FieldSVG'
import { G, Path } from './lib'
import { Renderer } from './Renderer'
import { Dragger } from './utils'
import { Connection, ConnectionType } from './Connection'

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
  contentWidth: number
  contentHeight: number

  previousConnection: Connection
  nextConnection: Connection
  outputConnection: Connection

  dragger: Dragger

  constructor(block: Block, renderer: Renderer, options: Partial<BlockSVGOption> = {}) {
    super()
    this.addClasses('s_block')

    this.options = new Configuration({
      fieldGap: 5,
      horizontalPadding: 8,
      verticalPadding: 5,
      x: 0,
      y: 0,
      draggable: true,
      ...options
    })

    this.contentHeight = 0
    this.contentWidth = 0
    this.$r = renderer
    this.$b = block
    this.fields = new SArray()

    this.move(this.options.get('x'), this.options.get('y'))

    this._initBackground()
    this._initFieldSVG()
    this._initDragger()
    this._initConnections()

    this.updateShape()
  }

  private _initConnections() {
    if (this.$b.config.get('previous')) {
      this.previousConnection = this.$r.connectionManger.createConnection(this, {
        x: this.x,
        y: this.y,
        type: ConnectionType.blockPrevious
      })
    }

    if (this.$b.config.get('next')) {
      this.nextConnection = this.$r.connectionManger.createConnection(this, {
        x: this.x,
        y: this.y,
        type: ConnectionType.blockNext
      })
    }

    if (this.$b.config.get('output').length) {
      this.outputConnection = this.$r.connectionManger.createConnection(this, {
        x: this.x,
        y: this.y,
        type: ConnectionType.blockOutput
      })
    }
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

    this.dragger.on('dragstart', () => {
      const id = this.$r.effects.dragging.id
      this.dom.style.filter = `url(#${id})`

      this.addClasses('s_block_dragging')
      this.$r.workspaceSVG.displayAtTop(this)
    })

    this.dragger.on('dragend', () => {
      this.$r.workspaceSVG.resize()
      this.dom.style.filter = ''
      this.removeClasses('s_block_dragging')
    })
  }

  private _initFieldSVG() {
    for (const field of this.$b.fieldManager.fields) {
      const Ctor = this.$r.getFieldCtor(field.type)

      if (Ctor) {
        const fieldSVG = new Ctor(field)

        this.fields.pushDistinct(fieldSVG)
        this.append(fieldSVG.svg)
      }
    }
  }

  updateFieldsShape() {
    let x = 0
    let y = 0

    for (let idx = 0; idx < this.fields.length; idx++) {
      const field = this.fields[idx]
      const previousField = this.fields[idx - 1]
      const isFirstField = idx === 0

      x = isFirstField ? this.options.get('horizontalPadding') : this.options.get('fieldGap')
      y = this.options.get('verticalPadding')

      y += (this.contentHeight - field.svg.bbox.height) / 2

      if (previousField) {
        x += previousField.svg.x + previousField.svg.bbox.width
      }

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

    this.contentWidth =
      this.fields.reduce((pre, cur) => pre + cur.svg.bbox.width, 0) +
      (this.fields.length - 1) * this.options.get('fieldGap')

    this.contentHeight = Math.max(...this.fields.map((f) => f.svg.bbox.height))

    const totalWidth = this.contentWidth + this.options.get('horizontalPadding') * 2
    const totalHeight = this.contentHeight + this.options.get('verticalPadding') * 2

    const joinHeight = 5
    const joinWidth = 10
    const joinStartWidth = 5

    // Start update shape
    this.background.d.clear()
    this.background.d.M(0, 0).h(joinStartWidth)

    // Draw previous connection
    if (this.$b.config.get('previous')) {
      this.background.d
        .v(-joinHeight)
        .h(joinWidth)
        .v(joinHeight)
    } else {
      this.background.d.h(joinWidth)
    }

    // Draw right component
    const extraHeight = this.$b.config.get('next') ? joinHeight : 0
    this.background.d
      .h(totalWidth - joinStartWidth - joinWidth)
      .v(totalHeight + extraHeight)
      .h(-(totalWidth - joinStartWidth - joinWidth))

    // Draw next connection
    if (this.$b.config.get('next')) {
      this.background.d
        .v(-joinHeight)
        .h(-joinWidth)
        .v(joinHeight)
    } else {
      this.background.d.h(-joinWidth)
    }

    this.background.d.h(-joinStartWidth).z()
  }

  updateShape() {
    if (!this.rendered) {
      return
    }

    this.updateBackgroundShape()
    this.updateFieldsShape()
  }
}
