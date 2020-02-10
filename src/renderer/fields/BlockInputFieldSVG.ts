import { BlockInputField } from '@/fields'
import { Text, G, Path } from '../lib'
import { FieldSVG } from './FieldSVG'
import { BlockSVG } from '../BlockSVG'
import { css } from '../utils'

export class BlockInputFieldSVG extends FieldSVG<BlockInputField, G> {
  background: Path
  text: Text

  constructor(block: BlockSVG, field: BlockInputField) {
    super(block, field, new G())

    this.svg.addClasses('s_field_input')
    this._initBackground()
    this._initBackgroundText()
  }

  private _initBackgroundText() {
    this.text = new Text(this.$f.value())
    this.text.addClasses('s_field_input_text')
    this.svg.append(this.text)

    this.text.on('click', this.focus)
  }

  private _initBackground() {
    this.background = new Path()
    this.background.addClasses('s_field_input_background')
    this.svg.append(this.background)

    this.background.on('click', this.focus)
  }

  private _buildInput() {
    const input = document.createElement('input')
    const rect = this.svg.dom.getBoundingClientRect()

    css(input, {
      position: 'fixed',
      outline: 'none',
      border: 'none',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    })

    input.addEventListener('input', (e: InputEvent) => {
      const inputValue = input.value
      this.text.text(inputValue)
      this.$f.value(inputValue)

      this.updateShape()

      const rect = this.svg.dom.getBoundingClientRect()

      css(input, {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      })
    })

    input.value = this.$f.value()

    return input
  }

  private _updateBackgroundShape() {
    this.background.d.clear()
    const size = this.text.bbox
    const padding = 5

    this.background.d
      .M(0, 0)
      .h(size.width + padding * 2)
      .v(size.height + padding * 2)
      .h(-(size.width + padding * 2))
      .v(-(size.height + padding * 2))
      .z()

    this.text.move(padding, padding)
  }

  focus = () => {
    super.focus()

    const floatWeight = this.$b.$r.floatWeight

    const input = this._buildInput()
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        floatWeight.hide()
      }
    })

    floatWeight.replace(input)
    floatWeight.toggle()

    input.focus()
  }

  initShape() {
    this._updateBackgroundShape()
  }

  updateShape() {
    this._updateBackgroundShape()
    this.$b.updateShape()
  }
}
