import { BlockField, Block, Workspace } from '@/core'
import { warn } from '@/shared'
import { Codes } from './Codes'

export class CodeBlocks {
  blocks: {
    [name: string]: (block: Block) => string
  }

  constructor() {
    this.blocks = {}
  }

  register(name: string, func: (block: Block) => string) {
    this.blocks[name] = func
  }

  get(name: string): Function | null {
    return this.blocks[name] || null
  }
}

export class CodeGenerator {
  static indentSize: number = 2

  $w: Workspace | null

  name: string

  blocks: CodeBlocks

  codes: Codes

  constructor(name = '') {
    this.name = name
    this.$w = null
  }

  generate(workspace: Workspace): string {
    this.$w = workspace

    let code = this.startCode()

    this.$w.blockRoots.forEach((block) => {
      code += this.blockToCode(block)
    })

    code + this.finishedCode()

    return code
  }

  registerBlock(name: string, func: (block: Block) => string) {
    this.blocks.register(name, func)
  }

  startCode(): string {
    return ''
  }

  finishedCode(): string {
    return ''
  }

  blockToCode(block: Block): string {
    let func = this.blocks.get(block.config.get('name')!)

    if (!func) {
      warn(`Can't found ${block.config.get('name')!}'s generator`)
      return ''
    }

    return func(block)
  }

  fieldToCode(filed: BlockField) {
    return ''
  }
}
