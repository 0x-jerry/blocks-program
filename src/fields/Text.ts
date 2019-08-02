import * as SVG from '@svgdotjs/svg.js'
import { Field } from './Field'
import { BlockContainer } from '../blocks/Container'
import { Gesture, GestureEvent } from '../utils/Gesture'

export class FieldText extends Field {
  group: SVG.G
  shape: SVG.Text
  value: string
  inputDom: HTMLInputElement

  constructor(block: BlockContainer, value: string = '') {
    const group = new SVG.G()
    super(block, group)

    this.group = group

    const shape = new SVG.Text()
    shape.text(value)
    shape.addClass('blockly-field-text')
    this.shape = shape

    this.group.add(this.shape)

    this.value = value
    this.gesture = new Gesture(this.group.node)
    this.createInputDom()
    this.initializeGesture()
  }

  private initializeGesture() {
    this.gesture.on(GestureEvent.click, (e: MouseEvent) => {
      const shapeBox = this.group.node.getBoundingClientRect()

      const widget = this.sourceBlock.workspace.toolWidget

      this.inputDom.value = this.value
      this.inputDom.style.height = shapeBox.height + 'px'

      widget.setDom(this.inputDom)
      widget.show(shapeBox.top, shapeBox.left)

      this.inputDom.focus()
      this.inputDom.select()
    })
  }

  setValue(text: string) {
    this.value = text
    this.shape.text(text)
    this.updateSourceBlock()
  }

  getValue(): string {
    return this.value
  }

  private createInputDom() {
    this.inputDom = document.createElement('input')
    this.inputDom.style.width = this.rectBox().w + 'px'
    this.inputDom.classList.add('blockly-tool-widget_input')

    this.inputDom.addEventListener('input', (e) => {
      const text = (e.target as HTMLInputElement).value
      this.setValue(text)

      const fixedInputShake = 1
      this.inputDom.style.width = this.rectBox().w + fixedInputShake + 'px'
    })
  }
}
