import { BlockSlotField } from '../../core/fields'
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

  private _connAction: IConnectionAction = (trigger, destConn) => {
    this.$f.block.update(destConn?.targetConnection?.sourceBlock.$b || null)

    this.$b.updateShape()

    if (!destConn || trigger) {
      return
    }

    const destPos = destConn.sourceBlock.getWorldPosition()
    const curPos = this.$b.getWorldPosition()
    curPos.x += this.connection.dx
    curPos.y += this.connection.dy

    const dPos = {
      x: destPos.x - curPos.x,
      y: destPos.y - curPos.y
    }

    this.$b.getTopBlock().dmove(dPos.x, dPos.y)

    this.$b.append(destConn.sourceBlock)
    destConn.sourceBlock.move(this.connection.dx, this.connection.dy)
  }

  private _updateConnectedBlockPosition() {
    const targetBlock = this.connection.targetConnection?.sourceBlock
    if (!targetBlock || targetBlock.isRootBlock()) {
      return
    }

    targetBlock.move(this.connection.dx, this.connection.dy)
  }

  updateConnPosition(dx: number, dy: number) {
    this.svg.move(dx, dy)
    this.connection.dx = dx
    this.connection.dy = dy
    this._updateConnectedBlockPosition()
  }
}
