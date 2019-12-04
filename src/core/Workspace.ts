import { uid, removeArrayItem, getId } from '@/shared'
import { Block } from './Block'

export class Workspace {
  readonly id: string
  blockDB: Block[]

  blockRoots: Block[]

  constructor(id: string = uid()) {
    this.id = id
    this.blockDB = []
    this.blockRoots = []
  }

  hasRootBlock(blockOrId: Block | string): false | Block {
    const id = getId(blockOrId)

    return this.blockRoots.find((b) => b.id === id) || false
  }

  private addRootBlock(block: Block) {
    if (!this.hasRootBlock(block)) {
      this.blockRoots.push(block)
    }
  }

  hasBlock(block: Block | string): false | Block {
    const id = getId(block)

    return this.blockDB.find((b) => b.id === id) || false
  }

  addBlock(block: Block) {
    if (!this.hasBlock(block)) {
      this.blockDB.push(block)
      block.setWorkspace(this)
    }

    if (block.isRoot) {
      this.addRootBlock(block)
    }

    if (block.next.value) {
      this.addBlock(block.next.value)
    }
  }

  removeBlock(block: Block) {
    if (!this.hasBlock(block)) {
      return
    }

    if (block.isRoot) {
      removeArrayItem(this.blockRoots, block)
    }

    removeArrayItem(this.blockDB, block)

    block.setWorkspace(null)

    if (block.next.value) {
      this.removeBlock(block.next.value)
    }
  }

  connectBlock(parent: Block, block: Block) {
    if (block.isRoot) {
      removeArrayItem(this.blockRoots, block)
    }

    block.connectTo(parent)
  }
}
