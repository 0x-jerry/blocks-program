import { ObjectAny } from '@/typedef'
import { Block } from '../Block'

class BlockJSONParser {
  parse(json: ObjectAny): Block | null {
    return null
  }
}

export const blockJSONParser = new BlockJSONParser()
