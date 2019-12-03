import { Block } from './Block'

export class BlockSlot {
  /**
   * Block
   */
  $b: Block

  constructor(block: Block) {
    this.$b = block
  }
}
