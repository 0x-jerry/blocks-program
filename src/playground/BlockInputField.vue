<template>
  <div :id="id"></div>
</template>

<script>
import { Block, Workspace } from '../core'
import { BlockDropdownField, BlockInputField, BlockSlotField, BlockTextField } from '../core/fields'
import { SVG, Rect, PatternGrid, Area, Renderer } from '../renderer'
import { uuid } from '../shared'

export default {
  data() {
    return {
      id: uuid()
    }
  },
  mounted() {
    const workspace = new Workspace()
    const renderer = new Renderer(workspace, 600, 400)
    renderer.mount(document.getElementById(this.id))

    workspace.definedBlocks.add(createBlock({}, 'input'))

    renderer.$w.addBlock('input', 100, 50)

    function createBlock(opt = {}, id) {
      const block = new Block(opt, id)

      const field = new BlockTextField('text1', 'hello')
      const field1 = new BlockInputField('text2', 'input')
      block.pushField(field)
      block.pushField(field1)

      return block
    }
  }
}
</script>
