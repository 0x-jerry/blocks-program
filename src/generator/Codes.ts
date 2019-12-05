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
