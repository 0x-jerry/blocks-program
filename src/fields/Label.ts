import { Field } from './Field'
import { BlockContainer } from '../blocks/Container'
import { SElement } from '../svg/SVGElement'

export class FieldLabel extends Field<string> {
  group: SElement<'text'>

  constructor(block: BlockContainer, value: string = '') {
    const shape = new SElement('text')
    shape.addClasses('blockly-field-text')
    shape.dom.textContent = value

    super(block, shape)

    this.setValue(value)
  }

  setValue(value: string) {
    this.value = value
    this.group.dom.textContent = value
    this.updateSourceBlock()
  }

  getValue() {
    return this.value
  }
}
