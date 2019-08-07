import { Field } from './Field'
import { BlockContainer } from '../blocks/Container'
import { SElement } from '../svg/SVGElement'

export class FieldLabel extends Field<string> {
  shape: SElement<'text'>

  constructor(block: BlockContainer, value: string = '') {
    const shape = new SElement('text')
    super(block, shape)

    shape.addClasses('blockly-field-text')
    shape.dom.textContent = value

    this.shape = shape

    this.setValue(value)
  }

  setValue(value: string) {
    this.value = value
    this.shape.dom.textContent = value
    this.updateSourceBlock()
  }

  getValue() {
    return this.value
  }
}
