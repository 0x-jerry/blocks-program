import * as SVG from '@svgdotjs/svg.js'
import { Field } from './Field'
import { BlocksContainer } from '../blocks/Container'
import { Gesture } from '../utils/Gesture'

export class FieldText extends Field {
  shape: SVG.Text
  value: string
  inputDom: HTMLInputElement

  constructor(block: BlocksContainer, value: string = '') {
    const shape = new SVG.Text()
    shape.text(value)
    shape.addClass('blockly-field-text')

    super(block, shape)

    this.value = value
    this.gesture = new Gesture(this.shape.node)
    this.createInputDom()
    this.initializeGesture()
  }

  initializeGesture() {
    this.gesture.on('click', (e: MouseEvent) => {
      const shapeBox = this.shape.node.getBoundingClientRect()

      const widget = this.block.workspace.toolWidget

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
    this.update()
  }

  createInputDom() {
    this.inputDom = document.createElement('input')
    this.inputDom.style.width = this.shape.bbox().w + 'px'
    this.inputDom.classList.add('blockly-tool-widget_input')

    this.inputDom.addEventListener('input', (e) => {
      const text = (e.target as HTMLInputElement).value
      this.setValue(text)

      this.inputDom.style.width = this.shape.bbox().w + 'px'
    })
  }

  update(): void {
    this.block.updateField(this)
  }
}
