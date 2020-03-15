import { Block } from '@/core'
import { FieldTypes } from '@/core/fields'
import { SArray, EventEmitter } from '@/shared'
import { FieldSVG } from './fields/FieldSVG'
import { G, Path } from './lib'
import { Renderer } from './Renderer'
import { Dragger, css } from './utils'
import { Connection, ConnectionType, IConnectionAction } from './Connection'
import { BlockSlotFieldSVG } from './fields'

export type IBlockSVGEventMap = {
  beforeDestory(): void
}

export interface IBlockSVGOption {
  x: number
  y: number
  draggable: boolean
  /**
   * Block defined id
   */
  type: string
}

export interface IBlockSVGRenderOption {
  joinHeight: number
  joinWidth: number
  joinStartWidth: number

  slotWidth: number
  emptyHeight: number

  fieldGap: number
  horizontalPadding: number
  verticalPadding: number
}

export class BlockSVG extends G {
  readonly $b: Block
  readonly $r: Renderer
  options: IBlockSVGOption

  background: Path
  fields: SArray<FieldSVG>[]

  previousConnection?: Connection
  nextConnection?: Connection
  outputConnection?: Connection

  dragger: Dragger

  events: EventEmitter<IBlockSVGEventMap>

  private _isFirstTimeToRender: boolean

  get nextBlock() {
    return this.nextConnection?.targetConnection?.sourceBlock
  }

  get previousBlock() {
    return this.previousConnection?.targetConnection?.sourceBlock
  }

  constructor(block: Block, renderer: Renderer, options: Partial<IBlockSVGOption> = {}) {
    super()
    this.events = new EventEmitter()

    this.addClasses('s_block')
    this._isFirstTimeToRender = true

    this.options = {
      x: 0,
      y: 0,
      draggable: true,
      type: '',
      ...options
    }

    this.$r = renderer
    this.$b = block
    this.fields = []

    this.move(this.options.x, this.options.y)

    this._initBackground()
    this._initFieldSVG()
    this._initDragger()
    this._initConnections()

    this.updateShape()
  }

  private _initConnections() {
    if (this.$b.options.previous) {
      // Initialize previous connection
      this.previousConnection = this.$r.connectionManager.createConnection(this, {
        type: ConnectionType.blockPrevious,
        acceptTypes: [ConnectionType.blockNext, ConnectionType.slotField],
        connectAction: this._previousConnAction
      })
    }

    if (this.$b.options.next) {
      // Initialize next connection
      this.nextConnection = this.$r.connectionManager.createConnection(this, {
        type: ConnectionType.blockNext,
        acceptTypes: [ConnectionType.blockPrevious],
        connectAction: this._nextConnAction
      })
    }

    if (this.$b.options.output.length) {
      // Initialize output connection
      this.outputConnection = this.$r.connectionManager.createConnection(this, {
        type: ConnectionType.blockOutput,
        acceptTypes: [],
        connectAction: this._outputConnAction
      })
    }
  }

  private _outputConnAction: IConnectionAction = (triggerOnly, destConn) => {
    if (triggerOnly || !destConn) {
      return
    }
    // todo
    // this.previousConnection?.sourceBlock.$b.connectTo(destConn.sourceBlock.$b)
    // destConn.sourceBlock.append(this)
    // this.move(destConn.dx, destConn.dy)
  }

  private _nextConnAction: IConnectionAction = (triggerOnly, destConn) => {
    this.$b.next.update(destConn?.sourceBlock.$b || null)

    if (triggerOnly || !destConn) {
      return
    }

    const destPos = destConn.sourceBlock.getWorldPosition()

    const curPos = this.getWorldPosition()

    curPos.x += this.nextConnection!.dx
    curPos.y += this.nextConnection!.dy

    const dPos = {
      x: destPos.x - curPos.x,
      y: destPos.y - curPos.y
    }

    this.getTopBlock().dmove(dPos.x, dPos.y)

    this.append(destConn.sourceBlock)
    destConn.sourceBlock.move(this.nextConnection!.dx, this.nextConnection!.dy)

    this.inSlotField()?.updateShape()
  }

  private _previousConnAction: IConnectionAction = (triggerOnly, destConn) => {
    this.$b.previous.update(destConn?.sourceBlock.$b || null)

    if (triggerOnly || !destConn) {
      this.inSlotFieldBefore()?.updateShape()
      return
    }

    destConn.sourceBlock.append(this)
    this.move(destConn.dx, destConn.dy)

    this.inSlotField()?.updateShape()
  }

  private _initBackground() {
    this.background = new Path()
    this.background.addClasses('s_block_background')
    this.append(this.background)
  }

  private _initDragger() {
    if (!this.options.draggable) {
      return
    }

    const textFields = this.fields
      .flat()
      .filter((f) => f.$f.type === FieldTypes.text)
      .map((f) => f.svg.dom)

    this.dragger = new Dragger(this.background.dom, ...textFields)

    this.dragger.on('dragging', (dx, dy) => {
      this.dmove(dx, dy)
    })

    this.dragger.on('dragstart', () => {
      const id = this.$r.effects.dragging.id
      css(this.dom, { filter: `url(#${id})` })

      this.addClasses('s_block_dragging')
    })

    this.dragger.on('dragend', () => {
      css(this.dom, { filter: '' })
      this.removeClasses('s_block_dragging')
    })
  }

  private _initFieldSVG() {
    for (const field of this.$b.fields) {
      const Ctor = this.$r.fieldFactory.get(field.type)

      if (Ctor) {
        const fieldSVG = new Ctor(this, field)

        this._addField(fieldSVG, field.rowIdx)
        this.append(fieldSVG.svg)
      }
    }
  }

  private _addField(fieldSVG: FieldSVG, rowIdx: number = 0) {
    this.fields[rowIdx] = this.fields[rowIdx] || new SArray()
    this.fields[rowIdx].pushDistinct(fieldSVG)
  }

  /**
   *
   * @returns content size
   */
  private _updateFieldsInline(fields: FieldSVG[], startY: number) {
    const rendererOptions = this.$r.rendererOptions.block

    let x = 0

    const width =
      fields.reduce((pre, cur) => pre + cur.svg.bbox.width, 0) + rendererOptions.fieldGap * (fields.length - 1)
    const height = Math.max(...fields.map((f) => f.svg.bbox.height))

    for (let colIdx = 0; colIdx < fields.length; colIdx++) {
      const field = fields[colIdx]
      const previousField = fields[colIdx - 1]
      const isFirstField = colIdx === 0

      x = isFirstField ? rendererOptions.horizontalPadding : rendererOptions.fieldGap

      const y = startY + (height - field.svg.bbox.height) / 2

      if (previousField) {
        x += previousField.svg.x + previousField.svg.bbox.width
      }

      field.svg.move(x, y)
    }

    return {
      width,
      height
    }
  }

  private _updateSlotField(field: BlockSlotFieldSVG, startY: number) {
    const rendererOptions = this.$r.rendererOptions.block
    const block = field.connection.targetConnection?.sourceBlock
    field.svg.move(rendererOptions.slotWidth, startY)

    field.updateConnPosition(rendererOptions.slotWidth, startY)

    const contentSize = {
      width: 0,
      height: rendererOptions.emptyHeight
    }

    if (!block) {
      return contentSize
    }

    // todo ,check height
    contentSize.height = block.getContentHeightWithAllNextBlocks()

    return contentSize
  }

  private _updateJoinStartShape() {
    const rendererOptions = this.$r.rendererOptions.block
    this.background.d.h(rendererOptions.joinStartWidth)

    if (this.$b.options.previous) {
      this.background.d
        .v(-rendererOptions.joinHeight)
        .h(rendererOptions.joinWidth)
        .v(rendererOptions.joinHeight)
    } else {
      this.background.d.h(rendererOptions.joinWidth)
    }
  }

  private _updateMultiRowFields(
    fields: SArray<FieldSVG>[],
    startY: number,
    isSlot = false
  ): { width: number; height: number } {
    const rendererOptions = this.$r.rendererOptions.block

    let rowSize = { width: 0, height: 0 }

    if (isSlot) {
      rowSize = this._updateSlotField(fields[0][0] as any, startY)
    } else {
      const contentSize = {
        width: 0,
        height: 0
      }

      let y = startY + rendererOptions.verticalPadding

      for (const subFields of fields) {
        const size = this._updateFieldsInline(subFields, y)
        contentSize.width = Math.max(contentSize.width, size.width)
        contentSize.height += size.height

        y += size.height
      }

      rowSize.width = contentSize.width
      rowSize.height = contentSize.height + rendererOptions.verticalPadding * 2
    }

    return rowSize
  }

  private _firstTimeToUpdateShape() {
    if (!this._isFirstTimeToRender) {
      return
    }

    this._isFirstTimeToRender = true

    for (const row of this.fields) {
      for (const f of row) {
        f.initShape()
      }
    }
  }

  getWorldPosition() {
    let block: BlockSVG | null = this

    let pos = {
      x: block.x,
      y: block.y
    }

    while (block?.previousBlock) {
      block = block.previousBlock || null

      if (block) {
        pos.x += block.x
        pos.y += block.y
      }
    }

    return pos
  }

  inSlotFieldBefore() {
    let previousOldConn = this.previousConnection?.oldTargetConnection
    while (previousOldConn) {
      if (previousOldConn.type === ConnectionType.slotField) {
        const b = previousOldConn.sourceBlock
        return b === this ? null : b
      }
      previousOldConn = previousOldConn.sourceBlock.previousConnection?.targetConnection
    }

    return null
  }

  inSlotField() {
    let block: BlockSVG = this

    while (block.previousConnection?.targetConnection) {
      if (block.previousConnection.targetConnection.type === ConnectionType.slotField) {
        const b = block.previousConnection.targetConnection.sourceBlock

        return b === this ? null : b
      }
      block = block.previousConnection.targetConnection.sourceBlock
    }

    return null
  }

  getContentHeightWithAllNextBlocks() {
    const rendererOptions = this.$r.rendererOptions.block
    const joinHeight = rendererOptions.joinHeight

    return this.bbox.height - (this.$b.options.previous ? joinHeight : 0)
  }

  getFieldRowCount() {
    return this.fields.length
  }

  getFieldsByRow(rowIdx = 0) {
    const fields = this.fields[rowIdx] || []

    fields.sort((a, b) => a.$f.colIdx - b.$f.colIdx)

    return fields
  }

  isRootBlock() {
    return !this.previousConnection?.targetConnection?.sourceBlock
  }

  getTopBlock() {
    let block: BlockSVG = this

    while (block.previousBlock) {
      block = block.previousBlock
    }

    return block
  }

  getTrialBlock() {
    let block: BlockSVG = this

    while (block.nextBlock) {
      block = block.nextBlock
    }

    return block
  }

  // todo
  updateOutputShape() {
    this.background.d.clear()
    this.background.d.M(0, 0).done()
  }

  updateShape() {
    if (!this.rendered) {
      return
    }

    this._firstTimeToUpdateShape()

    if (this.$b.hasOutput) {
      this.updateOutputShape()
      return
    }

    // Start update shape
    this.background.d.clear()
    this.background.d.M(0, 0)

    this._updateJoinStartShape()

    const isSlotFields = (fields: FieldSVG[]) => !!fields.length && fields[0].$f.type === FieldTypes.blockSlot

    const getAllTheSameKindFields = (fields: SArray<FieldSVG>, rowIdx: number) => {
      const currentFields = [fields]
      const isSlot = isSlotFields(fields)

      let nextFields = this.fields[rowIdx + 1]

      while (nextFields) {
        const isTheSameSlot = isSlot && isSlotFields(nextFields)
        const isTheSameNotSlot = !isSlot && !isSlotFields(nextFields)

        if (isTheSameSlot || isTheSameNotSlot) {
          currentFields.push(nextFields)
          rowIdx += 1
          nextFields = this.fields[rowIdx + 1]
        } else {
          break
        }
      }

      return currentFields
    }

    const rendererOptions = this.$r.rendererOptions.block
    const joinHeight = rendererOptions.joinHeight
    const joinWidth = rendererOptions.joinWidth
    const joinStartWidth = rendererOptions.joinStartWidth
    const slotWidth = rendererOptions.slotWidth
    const horizontalPadding = rendererOptions.horizontalPadding
    const emptyHeight = rendererOptions.emptyHeight

    const rowCount = this.getFieldRowCount()

    const rowSize: { width: number; height: number }[] = []
    const rowSlot: boolean[] = []

    let startY = 0

    for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
      const fields = this.fields[rowIdx]
      const isFirstRow = rowIdx === 0

      const isSlot = isSlotFields(fields)

      const currentFields = getAllTheSameKindFields(fields, rowIdx)
      rowIdx += currentFields.length - 1

      const contentSize = this._updateMultiRowFields(currentFields, startY, isSlot)
      startY += contentSize.height

      rowSize.push(contentSize)
      rowSlot.push(isSlot)

      if (isSlot) {
        const previousContentSize = rowSize[rowSize.length - 2]

        const totalWidth = previousContentSize.width + horizontalPadding * 2

        this.background.d
          .h(-(totalWidth - slotWidth - joinStartWidth - joinWidth))
          // 凸
          .v(-joinHeight)
          .h(-joinWidth)
          .v(joinHeight)
          // __凸
          .h(-joinStartWidth)
          // line
          .v(contentSize.height)
      } else {
        const totalWidth = contentSize.width + horizontalPadding * 2

        const width = totalWidth - (isFirstRow ? joinStartWidth + joinWidth : slotWidth)
        const height = contentSize.height

        this.background.d.h(width).v(height)
      }
    }

    if (rowSlot[rowSlot.length - 1] === true) {
      const tempWidth = 40
      this.background.d
        .h(tempWidth)
        .v(emptyHeight)
        .h(-(tempWidth + slotWidth - joinWidth - joinStartWidth))
    } else {
      const contentSize = rowSize[rowSize.length - 1]
      const totalWidth = contentSize.width + horizontalPadding * 2

      this.background.d.h(-(totalWidth - joinStartWidth - joinWidth))
    }

    // Draw next connection
    if (this.$b.options.next) {
      this.background.d
        .v(-joinHeight)
        .h(-joinWidth)
        .v(joinHeight)
    } else {
      this.background.d.h(-joinWidth)
    }

    this.background.d.h(-joinStartWidth).z()

    this.updateConnectionPosition()

    this.inSlotField()?.updateShape()
  }

  updateConnectionPosition() {
    const rendererOptions = this.$r.rendererOptions.block

    if (this.previousConnection) {
      this.previousConnection.dx = 0
      this.previousConnection.dy = 0
    }

    if (this.nextConnection) {
      this.nextConnection.dx = 0
      const newDy = this.background.bbox.height - (this.$b.options.previous ? rendererOptions.joinHeight : 0)

      // Update next block position when block shape changed.
      if (newDy !== this.nextConnection.dy) {
        this.nextConnection.dy = newDy
        this.nextConnection.targetConnection?.sourceBlock._previousConnAction(false, this.nextConnection, null)
      }
    }

    if (this.outputConnection) {
      this.outputConnection.dx = 0
      this.outputConnection.dy = 0
    }
  }

  async destroy() {
    await this.events.emit('beforeDestory')

    this.dragger.destroy()

    super.destroy()
  }
}
