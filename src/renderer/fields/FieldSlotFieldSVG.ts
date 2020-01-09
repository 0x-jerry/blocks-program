import { BlockSlotField } from '@/fields'
import { FieldSVG } from './FieldSVG'
import { G } from '../lib'
import { BlockSVG } from '../BlockSVG'
import { Connection, ConnectionType, IConnectionAction } from '../Connection'

export class BlockSlotFieldSVG extends FieldSVG<BlockSlotField, G> {
  connection: Connection

  constructor(block: BlockSVG, field: BlockSlotField) {
    super(block, field, new G())

    this.svg.addClasses('s_field_slot')

    this.connection = this.$b.$r.connectionManager.createConnection(this.$b, {
      dx: 0,
      dy: 0,
      type: ConnectionType.slotField,
      acceptTypes: [ConnectionType.blockPrevious],
      connectAction: this._connAction
    })
  }

  private _getOffsetOfRootBlock() {
    let block: BlockSVG = this.$b

    const offset = {
      x: 0,
      y: 0
    }

    while (block.previousConnection?.targetConnection) {
      const targetConn = block.previousConnection.targetConnection

      if (targetConn.type === ConnectionType.slotField) {
        offset.x += targetConn.dx
        offset.y += targetConn.dy
      }

      block = block.previousConnection.targetConnection.sourceBlock
    }

    return offset
  }

  private _connAction: IConnectionAction = (trigger, destConn) => {
    this.$f.block.update(destConn?.targetConnection?.sourceBlock.$b || null)

    this.$b.updateShape()

    if (!destConn || trigger) {
      return
    }

    const rootBlock = this.$b.getRootBlock()

    const destPos = this.$b.$r.$w.getWorldPosition(destConn.sourceBlock)

    const offset = this._getOffsetOfRootBlock()
    console.log(offset)

    destPos.x -= offset.x + this.connection.dx
    destPos.y -= offset.y + this.connection.dy

    rootBlock.move(destPos.x, destPos.y)

    this.$b.append(destConn.sourceBlock)
    destConn.sourceBlock.move(this.connection.dx, this.connection.dy)
  }

  updateConnPosition(dx: number, dy: number) {
    this.svg.move(dx, dy)
    this.connection.dx = dx
    this.connection.dy = dy
  }
}
