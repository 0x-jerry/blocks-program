import { Workspace } from './Workspace'
import { Block } from './Block'
import { BlockField } from '@/fields'
import { warn } from '@/shared'

export class CodeLine {
  parent: CodeLine | null
  previous: CodeLine | null
  next: CodeLine | null

  indent: number
  code: string

  constructor() {
    this.previous = null
    this.next = null
    this.indent = 0
    this.code = ''
    this.parent = null
  }

  getCode(): string {
    return ' '.repeat(this.indent * CodeGenerator.indentSize) + this.code
  }
}

export interface CodeDefineProvider {
  [name: string]: CodeLine[]
}

export class Codes {
  defines: CodeDefineProvider

  functions: CodeDefineProvider

  main: CodeLine[]

  finished: CodeDefineProvider

  constructor() {
    this.defines = {}
    this.functions = {}
    this.main = []
    this.finished = {}
  }

  private getCodes(provider: CodeDefineProvider): string[] {
    let codes: string[] = []

    const sortedKeys = Object.keys(provider).sort((a, b) => (a > b ? -1 : 1))

    sortedKeys.forEach((key) => {
      codes = codes.concat(provider[key].map((n) => n.getCode()))
    })

    return codes
  }

  addMain(...codes: CodeLine[]) {
    this.main.push(...codes)
  }

  addFunction(name: string, ...codes: CodeLine[]) {
    this.functions[name] = codes
  }

  addDefine(name: string, ...codes: CodeLine[]) {
    this.defines[name] = codes
  }

  addFinished(name: string, ...codes: CodeLine[]) {
    this.finished[name] = codes
  }

  getCode(): string {
    let codes: string[] = []

    codes = codes.concat(this.getCodes(this.defines)).concat(this.getCodes(this.functions))

    codes = codes.concat(this.main.map((n) => n.getCode()))

    codes = codes.concat(this.getCodes(this.finished))

    return codes.join('\n')
  }
}

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
    let func = this.blocks.get(block.name)

    if (!func) {
      warn(`Can't found ${block.name}'s generator`)
      return ''
    }

    return func(block)
  }

  fieldToCode(filed: BlockField) {
    return ''
  }
}
