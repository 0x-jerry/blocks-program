import { BlockDropdownField } from '@/core/fields'
import { Text, G, Path, SImage } from '../lib'
import { FieldSVG } from './FieldSVG'
import { BlockSVG } from '../BlockSVG'
import { css } from '../utils'

export class BlockDropdownFieldSVG extends FieldSVG<BlockDropdownField, G> {
  background: Path
  text: Text
  icon: SImage
  iconConfig: {
    size: number
    padding: number
  }

  constructor(block: BlockSVG, field: BlockDropdownField) {
    super(block, field, new G())
    this.iconConfig = {
      padding: 5,
      size: 26
    }

    this.svg.addClasses('s_field_dropdown')
    this._initBackground()
    this._initBackgroundText()
    this._initBackgroundDropdownIcon()
  }

  private _initBackgroundDropdownIcon() {
    this.icon = new SImage(this.$b.$r.assets.get('icons/caret-down.svg'))
    this.icon.addClasses('s_field_dropdown_icon')

    const size = this.iconConfig.size
    this.icon.attr({ width: size, height: size })

    this.svg.append(this.icon)

    this.icon.on('click', this.focus)
  }

  private _initBackgroundText() {
    this.text = new Text(this.$f.selected.value)
    this.text.addClasses('s_field_dropdown_text')
    this.svg.append(this.text)

    this.text.on('click', this.focus)
  }

  private _initBackground() {
    this.background = new Path()
    this.background.addClasses('s_field_dropdown_background')
    this.svg.append(this.background)

    this.background.on('click', this.focus)
  }

  private _updateBackgroundShape() {
    this.background.d.clear()
    const size = this.text.bbox
    const padding = 5

    size.width += this.iconConfig.padding + this.iconConfig.size

    this.background.d
      .M(0, 0)
      .h(size.width + padding * 2)
      .v(size.height + padding * 2)
      .h(-(size.width + padding * 2))
      .v(-(size.height + padding * 2))
      .z()

    this.text.move(padding, padding)
  }

  private _buildSelector() {
    const rect = this.svg.dom.getBoundingClientRect()

    const $div = document.createElement('div')

    $div.classList.add('s_field_dropdown_select')

    for (const option of this.$f.options) {
      const $o = document.createElement('div')
      $o.classList.add('s_field_dropdown_select_option')

      $o.setAttribute('key', option.key)
      $o.setAttribute('value', option.value)
      $o.innerText = option.value

      $div.append($o)
    }

    const bbox = this.svg.bbox
    const tailHeihgt = bbox.height

    css($div, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top + tailHeihgt}px`,
      width: `${rect.width}px`
    })

    return $div
  }

  focus = () => {
    super.focus()
    const floatWeight = this.$b.$r.floatWeight
    const $select = this._buildSelector()

    floatWeight.replace($select)

    $select.onclick = (e) => {
      const el = e.target as HTMLDivElement
      const selectedKey = el.getAttribute('key') as string

      this.$f.value(selectedKey)
      this.text.text(this.$f.selected.value)

      floatWeight.hide()
      super.release()

      this.updateShape()
    }

    floatWeight.toggle()
  }

  initShape() {
    this._updateBackgroundShape()
    const textPos = this.text.x + this.text.bbox.width
    this.icon.move(textPos + this.iconConfig.padding, 0)
  }

  updateShape() {
    this._updateBackgroundShape()
    this.$b.updateShape()
  }
}
