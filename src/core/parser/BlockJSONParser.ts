import { ObjectAny } from '../../typedef'
import { Block, BlockConfigOption } from '../Block'
import { toArray, warn } from '../../shared'
import { BlockField } from '../BlockField'
import { fieldUtils, FieldTypes } from '../fields'

class BlockJSONParser {
  parse(json: ObjectAny): Block | null {
    const options = this.parseBlockOption({
      name: json['name'],
      output: json['output'],
      previous: json['previous'],
      next: json['next']
    })

    const block = new Block(options)

    const contents = this._parseContent(json['content'])

    contents.forEach((content, idx) => {
      const fields = this.parseFields(content, json['args'])
      fields.forEach((field) => {
        block.pushField(field, idx)
      })
    })

    return block
  }

  private _parseContent(content: string | string[] = ''): string[] {
    if (typeof content === 'string') {
      return content.split(/\n+/g)
    } else {
      return content.reduce((pre, cur) => pre.concat(cur.split(/\n+/g)), [] as string[])
    }
  }

  private parseFields(content: string, args: ObjectAny = {}): BlockField[] {
    const texts = content.split(/\s+/g)
    const fields = texts
      .map((text) => {
        let field: BlockField | null = null
        const name = text.slice(1)
        const config = args[name]

        if (text.startsWith('$')) {
          const Ctor = fieldUtils.get(config.type)

          if (!Ctor) {
            warn(BlockJSONParser.name, `Can't find ${config.type} field`)
          }
          if (Ctor) {
            field = new Ctor(config.name || name, config.value, config)
          }
        } else {
          const Ctor = fieldUtils.get(FieldTypes.text)!
          field = new Ctor(text, text)
        }

        return field
      })
      .filter((f) => !!f)

    return fields as BlockField[]
  }

  private parseBlockOption(json: {
    name?: string
    output?: string | string[]
    previous?: boolean
    next?: boolean
  }): Partial<BlockConfigOption> {
    const output = json.output ? toArray(json.output) : undefined
    return {
      name: json.name,
      output: output,
      previous: output ? undefined : this.parseBool(json.previous),
      next: output ? undefined : this.parseBool(json.next)
    }
  }

  private parseBool(b: any, defaultValue = true): boolean {
    return b === undefined ? defaultValue : !!b
  }
}

export const blockJSONParser = new BlockJSONParser()
