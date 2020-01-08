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
      type: ConnectionType.field,
      connectAction: (destConn) => {
        // do nothing
      }
    })
  }
}
