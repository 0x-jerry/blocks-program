import { uuid, getId, SArray } from '@/shared'
import { Block } from './Block'

class DefinedBlocks {
  blocks: SArray<Block>

  constructor() {
    this.blocks = new SArray()
  }

  add(block: Block) {
    this.blocks.pushDistinct(block)
  }

  remove(blockOrId: Block | string): Block | null {
    return typeof blockOrId === 'string'
      ? this.blocks.remove((b) => b.id === blockOrId)
      : this.blocks.removeItem(blockOrId)
  }

  get(id: string): Block | null {
    return this.blocks.find((b) => b.id === id) || null
  }

  clear(destroyOldBlocks = true): SArray<Block> {
    if (destroyOldBlocks) {
      this.destroy()
    }

    const olds = this.blocks

    this.blocks = new SArray()

    return olds
  }

  destroy() {
    this.blocks.forEach((b) => b.destroy())
  }
}

export class Workspace {
  readonly id: string
  definedBlocks: DefinedBlocks

  blockDB: SArray<Block>

  blockRoots: SArray<Block>

  constructor(id: string = uuid()) {
    this.id = id

    this.definedBlocks = new DefinedBlocks()
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
