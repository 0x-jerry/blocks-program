import { Field } from './Field'
import { Blocks } from '../core/Blocks'
import { Gesture, GestureEvent } from '../utils/Gesture'
import { SElement } from '../svg/SVGElement'

export class FieldText extends Field<string> {
  group: SElement<'g'>
  shape: SElement<'text'>
  inputDom: HTMLInputElement

  constructor(block: Blocks, value: string = '') {
    const group = new SElement('g')
    super(block, group)

    this.group = group

    const shape = new SElement('text')
    shape.dom.textContent = value
    shape.addClasses('blockly-field-text')
    this.shape = shape

    this.group.add(this.shape)

    this.value = value
    this.gesture = new Gesture(this.group.dom)
    this.createInputDom()
    this.initializeGesture()
  }

  private initializeGesture() {
    this.gesture.on(GestureEvent.click, (e: MouseEvent) => {
      const shapeBox = this.group.dom.getBoundingClientRect()

      const widget = this.sourceBlock.workspace.toolWidget

      this.inputDom.value = this.value
      this.inputDom.style.width = shapeBox.width + 'px'
      this.inputDom.style.height = shapeBox.height + 'px'

      widget.setDom(this.inputDom)
      widget.show(shapeBox.top, shapeBox.left)

      this.inputDom.focus()
      this.inputDom.select()
    })
  }

  setValue(text: string) {
    this.value = text
    this.shape.dom.textContent = text
    this.updateSourceBlock()
  }

  getValue(): string {
    return this.value
  }

  private createInputDom() {
    this.inputDom = document.createElement('input')
    this.inputDom.style.width = this.rectBox().width + 'px'
    this.inputDom.classList.add('blockly-tool-widget_input')

    this.inputDom.addEventListener('input', (e) => {
      const text = (e.target as HTMLInputElement).value
      this.setValue(text)

      const fixedInputShake = 1
      this.inputDom.style.width = this.rectBox().width + fixedInputShake + 'px'
    })
  }
}
