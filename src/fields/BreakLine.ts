import { Field } from './Field'
import { FieldTypes } from './FieldTypes';

export class BreakLine extends Field<string> {
  type = FieldTypes.BreakLine

  constructor() {
    super(null, null)
  }

  setValue(text: string) {}

  getValue(): string {
    return null
  }
}
