import { uuid, getId } from '@/shared'
import { Block } from './Block'

class DefinedBlocks {
  private _blocksMap: Map<string, Block>

  get blocks() {
    return this._blocksMap
  }

  constructor() {
    this._blocksMap = new Map()
  }

  add(block: Block) {
    const name = (block.options.name = block.id)
    this._blocksMap.set(name, block)
  }

  remove(blockOrId: Block | string): Block | null {
    const name = typeof blockOrId === 'string' ? blockOrId : blockOrId.options.name

    const block = this._blocksMap.get(name)

    if (block) {
      this._blocksMap.delete(name)
    }

    return block || null
  }

  get(id: string): Block | null {
    return this._blocksMap.get(id) || null
  }

  clear() {
    this.destroy()

    this._blocksMap.clear()
  }

  destroy() {
    for (const [, b] of this._blocksMap) {
      b.destroy()
    }
  }
}

export class Workspace {
  readonly id: string
  definedBlocks: DefinedBlocks

  blockDB: Map<string, Block>

  blockRoots: Map<string, Block>

  constructor(id: string = uuid()) {
    this.id = id

    this.definedBlocks = new DefinedBlocks()
    this.blockDB = new Map()
    this.blockRoots = new Map()
  }

  private isRootBlock(blockOrId: Block | string): false | Block {
    const id = getId(blockOrId)

    return this.blockRoots.get(id) || false
  }

  private addRootBlock(block: Block) {
    if (!this.isRootBlock(block)) {
      this.blockRoots.set(block.id, block)
    }
  }

  hasBlock(blockOrId: Block | string): false | Block {
    const id = getId(blockOrId)

    return this.blockDB.get(id) || false
  }

  addBlock(block: Block) {
    if (!this.hasBlock(block)) {
      this.blockDB.set(block.id, block)
      block.setWorkspace(this)
    }

    if (block.isRoot) {
      this.addRootBlock(block)
    }

    if (block.next.value) {
      this.addBlock(block.next.value)
    }
  }

  removeBlock(blockOrId: Block | string) {
    const block = this.hasBlock(blockOrId)

    if (!block) {
      return null
    }

    if (block.isRoot) {
      this.blockRoots.delete(block.id)
    }

    this.blockDB.delete(block.id)

    block.setWorkspace(null)

    if (block.next.value) {
      this.removeBlock(block.next.value)
    }

    block.destroy()

    return block
  }

  connectBlock(block: Block, parent: Block) {
    if (block.isRoot) {
      this.blockRoots.delete(block.id)
    }

    block.previous.update(parent)
  }
}
