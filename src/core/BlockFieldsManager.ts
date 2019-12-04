import { Block } from './Block'
import { BlockField } from '../fields'

export class BlockFieldManager {
  /**
   * Block
   */
  $b: Block

  fields: BlockField[] = []

  constructor(block: Block) {
    this.$b = block
  }
}
