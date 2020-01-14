import { BlockTextField } from '@/fields'
import { Text, G, Path } from '../lib'
import { FieldSVG } from './FieldSVG'
import { BlockSVG } from '../BlockSVG'

export class BlockInputFieldSVG extends FieldSVG<BlockTextField, G> {
  background: Path
  text: Text

  constructor(block: BlockSVG, field: BlockTextField) {
    super(block, field, new G())

    this.svg.addClasses('s_field_input')
    this._initBackground()
    this._initInputText()
  }

  private _initInputText() {
    this.text = new Text(this.$f.value())
    this.text.addClasses('s_field_input_text')
    this.svg.append(this.text)
  }

  private _initBackground() {
    this.background = new Path()
    this.background.addClasses('s_field_input_background')
    this.svg.append(this.background)
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
