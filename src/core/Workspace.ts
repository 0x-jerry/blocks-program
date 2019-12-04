import { uid } from '@/shared'
import { Block } from './Block'

export class Workspace {
  readonly id: string
  blockDB: Block[]

  blockRoots: Block[]

  constructor(id: string = uid()) {
    this.id = id
    this.blockDB = []
  }

  hasBlock(block: Block): false | Block {
    return this.blockDB.find((b) => b.id === block.id) || false
  }

  addBlock(block: Block) {
    if (!this.hasBlock(block)) {
      this.blockDB.push(block)
    }
  }

  removeBlock(block: Block) {
    if (!this.hasBlock(block)) {
      return
    }

    if (block.isRoot) {
      const idx = this.blockRoots.indexOf(block)
      this.blockRoots.splice(idx, 1)
    }

    const idx = this.blockDB.indexOf(block)
    if (idx >= 0) {
      this.blockDB.splice(idx, 1)
    }

    block.destroy()
  }
}
