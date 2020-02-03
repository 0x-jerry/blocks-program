import { BlockTextField } from '@/fields'
import { Text, G, Path } from '../lib'
import { FieldSVG } from './FieldSVG'
import { BlockSVG } from '../BlockSVG'
import { css } from '../utils'

export class BlockInputFieldSVG extends FieldSVG<BlockTextField, G> {
  background: Path
  text: Text

  constructor(block: BlockSVG, field: BlockTextField) {
    super(block, field, new G())

    this.svg.addClasses('s_field_input')
    this._initBackground()
    this._initInputText()

    this.$b.events.on('initilaized', () => {
      this.$b.dragger.on('dragstart', () => {
        this.$b.$r.floatWeight.hide()
      })
    })
  }

  private _initInputText() {
    this.text = new Text(this.$f.value())
    this.text.addClasses('s_field_input_text')
    this.svg.append(this.text)

    this.text.on('click', this._focus)
  }

  private _initBackground() {
    this.background = new Path()
    this.background.addClasses('s_field_input_background')
    this.svg.append(this.background)

    this.background.on('click', this._focus)
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

      const rect = this.svg.dom.getBoundingClientRect()

      css(input, {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      })

      this.updateShape()
    })

    input.value = this.$f.value()

    return input
  }

  private _focus = () => {
    const floatWeight = this.$b.$r.floatWeight

    const input = this._buildInput()
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        floatWeight.hide()
      }
    })

    floatWeight.replace(input)
    floatWeight.show()
    input.focus()
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

  initShape() {
    this._updateBackgroundShape()
  }

  updateShape() {
    this._updateBackgroundShape()
    this.$b.updateShape()
  }
}
