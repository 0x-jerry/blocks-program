import { BlockSlotField } from '@/fields'
import { FieldSVG } from './FieldSVG'
import { G } from '../lib'
import { BlockSVG } from '../BlockSVG'
import { Connection, ConnectionType } from '../Connection'

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
      connectAction: (trigger, destConn) => {
        this.$f.block.update(destConn?.targetConnection?.sourceBlock.$b || null)

        this.$b.updateShape()

        if (!destConn || trigger) {
          return
        }

        const rootBlock = this.$b.getRootBlock()

        const destPos = this.$b.$r.$w.getWorldPosition(destConn.sourceBlock)

        destPos.x -= this.svg.x
        destPos.y -= this.svg.y

        rootBlock.move(destPos.x, destPos.y)
        console.log(this.connection, this.connection.dx)

        this.svg.append(destConn.sourceBlock)
        destConn.sourceBlock.move(0, 0)
      }
    })
  }

  updateConnPosition(dx: number, dy: number) {
    this.svg.move(dx, dy)
    this.connection.dx = dx
    this.connection.dy = dy
  }
}
