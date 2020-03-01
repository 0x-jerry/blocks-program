import { Block, Workspace } from '@/core'
import { warn, toArray } from '@/shared'
import { Codes } from './Codes'
import { BlockSlotField, FieldTypes } from '@/fields'

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
      warn(CodeBlocks.name, `Not found ${name}'s generate function.`)
    }

    return func || this.placeholderFunc
  }
}

interface GeneratorConfigOptions {
  indentSize: number
}

export class CodeGenerator {
  config: GeneratorConfigOptions
  name: string

  private blocks: CodeBlocks

  private codes: Codes

  constructor(name: string = '') {
    this.name = name
    this.config = { indentSize: 2 }
    this.blocks = new CodeBlocks()
    this.codes = new Codes()
  }

  private linePrefix(code: string, prefix: string) {
    return prefix + code.trim().replace(/\n/g, '\n' + prefix)
  }

  getCodes(workspace: Workspace) {
    workspace.blockRoots.forEach((block) => {
      const func = this.blocks.get(block.options.name)

      const codes = toArray(func(block, this))

      this.codes.addMain(codes)
    })

    return this.codes.getCode()
  }

  registerBlock(name: { [name: string]: GenerateFunc }): void
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

  provideFunction(name: string, ...codes: string[]) {
    this.codes.addFunction(name, codes)
  }

  provideDefine(name: string, ...codes: string[]) {
    this.codes.addDefine(name, codes)
  }

  provideFinished(name: string, ...codes: string[]) {
    this.codes.addFinished(name, codes)
  }

  /**
   * Get this block code and all the next connected block code
   * @param block
   */
  getTopBlockCode(block: Block): string {
    let codes = []
    let current: Block | null = block

    do {
      const blockCode = this.getBlockCode(current)
      codes.push(blockCode)

      current = current.next.value
    } while (current)

    return codes.join('\n')
  }

  /**
   * Get only current block code
   * @param block
   */
  getBlockCode(block: Block): string {
    const func = this.blocks.get(block.options.name)

    return toArray(func(block, this)).join('\n')
  }

  getFieldCode(block: Block, fieldName: string): string {
    const field = block.getField(fieldName)

    if (!field) {
      warn(CodeGenerator.name, `Not found ${fieldName} field on block id: ${block}`)
      return ''
    }

    if (field.type === FieldTypes.blockSlot) {
      warn(CodeGenerator.name, `Field ${fieldName} on block id: ${block} is a slot, use getSlotFieldCodes instead of.`)
      return ''
    }

    if (field.isBlock) {
      return this.getBlockCode(field.block.value!)
    }

    return String(field.value())
  }

  getSlotFieldCode(block: Block, fieldName: string): string {
    const field = block.getField(fieldName)

    if (!field) {
      warn(CodeGenerator.name, `Not found ${fieldName} field on block id: ${block}`)
      return ''
    }

    if (field.type !== FieldTypes.blockSlot) {
      warn(CodeGenerator.name, `Field ${fieldName} on block id: ${block} is not a slot, use getFieldCodes instead of.`)
      return ''
    }

    const slotField = field as BlockSlotField

    const slotBlock = slotField.value()

    const codes = slotBlock ? this.getTopBlockCode(slotBlock) : ''

    return this.linePrefix(codes, ' '.repeat(this.config.indentSize))
  }
}
