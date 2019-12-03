import { Block } from './Block'

export class BlockSlot {
  /**
   * Block
   */
  $b: Block

  /**
   * Next Block
   */
  next: Block | null

  constructor(block: Block) {
    this.$b = block
    this.next = null
  }
}
