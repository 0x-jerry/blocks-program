import { Block } from './Block'
import { BlockField } from 'packages/fields/src/BlockField'

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
