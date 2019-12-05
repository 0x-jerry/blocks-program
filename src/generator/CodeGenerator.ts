import { Block, Workspace } from '@/core'
import { Configuration, warn, toArray } from '@/shared'
import { Codes } from './Codes'
import { BlockSlotField } from '@/fields'

export interface GenerateFunc {
  (block: Block, generator: CodeGenerator): string | string[]
}

export class CodeBlocks {
  blocks: {
    [name: string]: GenerateFunc
  }

  constructor() {
    this.blocks = {}
  }

  register(name: string, func: GenerateFunc) {
    this.blocks[name] = func
  }

  private placeholderFunc() {
    return ''
  }

  get(name: string): GenerateFunc {
    const func = this.blocks[name]

    if (!func) {
      warn(`Not found ${name}'s generate function.`)
    }

    return func || this.placeholderFunc
  }
}

interface GeneratorConfigOptions {
  indentSize: number
}

export class GeneratorConfig extends Configuration<GeneratorConfigOptions> {
  constructor(opts: Partial<GeneratorConfigOptions> = {}) {
    const defaultOpts: GeneratorConfigOptions = {
      indentSize: 2
    }

    super(Object.assign(defaultOpts, opts))
  }
}

export class CodeGenerator {
  config: GeneratorConfig

  private blocks: CodeBlocks

  private codes: Codes

  constructor() {
    this.config = new GeneratorConfig()
    this.blocks = new CodeBlocks()
    this.codes = new Codes()
  }

  getCodes(workspace: Workspace) {
    workspace.blockRoots.forEach((block) => {
      const func = this.blocks.get(block.config.get('name'))

      const codes = toArray(func(block, this))

      this.codes.addMain(codes)
    })

    return this.codes.getCode()
  }

  registerBlock(name: string, func: GenerateFunc): void
  registerBlock(nameOrGenerates: { [name: string]: GenerateFunc } | string, func?: GenerateFunc): void {
    if (typeof nameOrGenerates === 'string') {
      this.blocks.register(nameOrGenerates, func!)
    } else {
      Object.entries(nameOrGenerates).forEach(([name, func]) => {
        this.blocks.register(name, func)
      })
    }
  }

  provideFunction(name: string, codes: string[]) {
    this.codes.addFunction(name, codes)
  }

  provideDefine(name: string, codes: string[]) {
    this.codes.addDefine(name, codes)
  }

  provideFinished(name: string, codes: string[]) {
    this.codes.addFinished(name, codes)
  }

  /**
   * Get this block code and all the next connected block code
   * @param block
   */
  getTopBlockCodes(block: Block): string[] {
    let codes: string[] = []
    let current: Block | null = block

    do {
      const blockCodes = this.getBlockCodes(current)
      codes.push(...blockCodes)

      current = current.next.value
    } while (current)

    return codes
  }

  getFieldCodes(block: Block, fieldName: string): string {
    const field = block.getField(fieldName)

    if (!field) {
      warn(`Not found ${fieldName} field on block id: ${block.id}`)
      return ''
    }

    if (field.type === 'Slot') {
      warn(`Field ${fieldName} on block id: ${block.id} is a slot, use getSlotFieldCodes instead of.`)
      return ''
    }

    if (field.isBlock) {
      return this.getBlockCodes(field.block.value!).join('')
    }

    return String(field.value())
  }

  getSlotFieldCodes(block: Block, fieldName: string): string[] {
    const field = block.getField(fieldName)

    if (!field) {
      warn(`Not found ${fieldName} field on block id: ${block.id}`)
      return []
    }

    if (field.type !== 'Slot') {
      warn(`Field ${fieldName} on block id: ${block.id} is not a slot, use getFieldCodes instead of.`)
      return []
    }

    const slotField = field as BlockSlotField

    const slotBlock = slotField.value()

    return slotBlock ? this.getTopBlockCodes(slotBlock) : []
  }

  /**
   * Get only current block code
   * @param block
   */
  getBlockCodes(block: Block): string[] {
    const func = this.blocks.get(block.config.get('name'))

    return toArray(func(block, this))
  }
}
