import { uuid, getId, SArray } from '@/shared'
import { Block } from './Block'

export class Workspace {
  readonly id: string
  blockDB: SArray<Block>

  blockRoots: SArray<Block>

  constructor(id: string = uuid()) {
    this.id = id
    this.blockDB = new SArray()
    this.blockRoots = new SArray()
  }

  private isRootBlock(blockOrId: Block | string): false | Block {
    const id = getId(blockOrId)

    return this.blockRoots.find((b) => b.id === id) || false
  }

  private addRootBlock(block: Block) {
    if (!this.isRootBlock(block)) {
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
      this.blockRoots.removeItem(block)
    }

    this.blockDB.removeItem(block)

    block.setWorkspace(null)

    if (block.next.value) {
      this.removeBlock(block.next.value)
    }
  }

  connectBlock(parent: Block, block: Block) {
    if (block.isRoot) {
      this.blockRoots.removeItem(block)
    }

    block.connectTo(parent)
  }
}
