export interface CodeDefineProvider {
  [name: string]: string[]
}

export class Codes {
  defines: CodeDefineProvider

  functions: CodeDefineProvider

  main: string[]

  finished: CodeDefineProvider

  constructor() {
    this.defines = {}
    this.functions = {}
    this.main = []
    this.finished = {}
  }

  private getCodes(provider: CodeDefineProvider): string[] {
    let codes: string[] = []

    const sortedKeys = Object.keys(provider).sort((a, b) => (a > b ? 1 : -1))

    sortedKeys.forEach((key) => {
      codes.push(...provider[key])
    })

    return codes
  }

  addMain(codes: string[]) {
    this.main.push(...codes)
  }

  addFunction(name: string, codes: string[]) {
    this.functions[name] = codes
  }

  addDefine(name: string, codes: string[]) {
    this.defines[name] = codes
  }

  addFinished(name: string, codes: string[]) {
    this.finished[name] = codes
  }

  getCode(): string {
    let codes: string[] = []

    codes.push(...this.getCodes(this.defines))
    codes.push(...this.getCodes(this.functions))
    codes.push(...this.main)
    codes.push(...this.getCodes(this.finished))

    return codes.join('\n')
  }
}
