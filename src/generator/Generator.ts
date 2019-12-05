import { Configuration } from '@/shared/Configuration'

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

export class Generator {
  config: GeneratorConfig

  constructor() {
    this.config = new GeneratorConfig()
  }
}
